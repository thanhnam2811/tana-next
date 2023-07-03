import React, { useState } from 'react';
import { useSWRFetcher } from '@common/hooks';
import { Badge, Button, Card, Image, List, Popconfirm } from 'antd';
import { AlbumFormType, AlbumType } from '@modules/user/types';
import { useUserContext } from '@modules/user/hooks';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';
import { AlbumModal } from '@modules/user/components';
import { toast } from 'react-hot-toast';
import { updateAlbumApi } from '@modules/user/api/updateAlbum.api';
import { createAlbumApi } from '@modules/user/api/createAlbum.api';
import { dateUtil, urlUtil } from '@common/utils';
import { PrivacyDropdown } from '@common/components/Button';
import { IFile, IPrivacy, MediaType } from '@common/types';
import { AlbumDetail } from '@modules/user/components/AlbumDetail';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { deleteAlbumApi } from '@modules/user/api/deleteAlbum.api';
import { uploadFileApi } from '@common/api';
import Link from 'next/link';

enum ModalType {
	ALBUM,
}

export function AlbumTab() {
	const { user, isCurrentUser } = useUserContext();
	const albumFetcher = useSWRFetcher<AlbumType>({ api: `/users/${user._id}/albums` });

	const [album, setAlbum] = useState<AlbumType>();

	const [modal, setModal] = useState<ModalType>();
	const closeModal = () => setModal(undefined);
	const openAlbumModal = (album?: AlbumType) => {
		setAlbum(album);
		setModal(ModalType.ALBUM);
	};

	const handleSubmit = async (data: AlbumFormType) => {
		const isEdit = !!album;
		const toastId = toast.loading(isEdit ? 'Đang cập nhật album' : 'Đang tạo album');

		try {
			if (isEdit) {
				const updated = await updateAlbumApi(album._id, data);
				await albumFetcher.updateData(album._id, updated);

				toast.success('Cập nhật album thành công', { id: toastId });
				closeModal();
			} else {
				const created = await createAlbumApi(data);
				toast.success('Tạo album thành công', { id: toastId });

				const listMedia: Partial<MediaType>[] = data.media;
				if (!listMedia?.length) {
					await albumFetcher.addData(created);
					closeModal();
				}

				const uploadToastId = toast.loading(`Đang tải ảnh lên album... (0/${listMedia.length})`);
				try {
					const files: IFile[] = [];
					const errors: string[] = [];

					await Promise.all(
						listMedia.map(async (media) => {
							try {
								const file = await uploadFileApi(media.file!, {
									album: created._id,
									description: media.description,
								});
								files.push(file);
							} catch (error: any) {
								errors.push(error.message || error.toString());
							}

							const numSuccess = files.length;
							toast.loading(`Đang tải ảnh lên album... (${numSuccess}/${listMedia.length})`, {
								id: uploadToastId,
							});
						})
					);

					const numSuccess = files.length;
					const numError = errors.length;
					toast.success(
						`Thêm ${numSuccess} ảnh lên album thành công! ${numError ? `(${numError} lỗi)` : ''}`,
						{ id: uploadToastId }
					);

					const cover = files.pop();
					if (cover) created.cover = cover;
				} catch (error) {
					toast.error(`Tải ảnh lên album thất bại! ${error}`, { id: uploadToastId });
				}

				await albumFetcher.addData(created);
				closeModal();
			}
		} catch (error) {
			if (isEdit) toast.error(`Cập nhật album thất bại! ${error}`, { id: toastId });
			else toast.error(`Tạo album thất bại! ${error}`, { id: toastId });
		}
	};

	const handleChangePrivacy = async (album: AlbumType, privacy: IPrivacy) => {
		const toastId = toast.loading('Đang thay đổi quyền riêng tư...');
		try {
			const updated = await updateAlbumApi(album._id, { privacy });
			await albumFetcher.updateData(updated._id, updated);

			toast.success('Thay đổi quyền riêng tư thành công!', { id: toastId });
		} catch (error) {
			await albumFetcher.updateData(album._id, album);
			toast.error(`Thay đổi quyền riêng tư thất bại! ${error}`, { id: toastId });
		}
	};

	const router = useRouter();
	const { aid } = router.query as { aid: string };
	const { mutate } = useSWRConfig();

	const goToAlbum = async (album: AlbumType) => {
		await mutate(`/albums/${album._id}`, album, false);
		return router.push({ pathname: router.pathname, query: { ...router.query, aid: album._id } }, undefined, {
			shallow: true, // prevent re-render
		});
	};

	const goBack = () =>
		router.push({ pathname: router.pathname, query: { ...router.query, aid: undefined } }, undefined, {
			shallow: true, // prevent re-render
		});

	if (aid)
		return (
			<AlbumDetail
				id={aid}
				onUpdate={(album) => albumFetcher.updateData(album._id, album)}
				onDelete={(id) => albumFetcher.removeData(id)}
				onBack={goBack}
			/>
		);

	const AlbumCard = ({ album }: { album: AlbumType }) => {
		const handleDeleteAlbum = async () => {
			const toastId = toast.loading('Đang xóa album...');
			try {
				await deleteAlbumApi(album._id);
				albumFetcher.removeData(album._id);
				toast.success('Xóa album thành công', { id: toastId });
			} catch (error) {
				toast.error(`Xóa album thất bại! ${error}`, { id: toastId });
			}
		};

		return (
			<Card
				cover={
					<Badge
						count={
							<PrivacyDropdown
								disabled
								value={album.privacy}
								onChange={(privacy) => handleChangePrivacy(album, privacy)}
								render={(privacy) => <Button icon={<privacy.RIcon />} size="small" shape="circle" />}
							/>
						}
					>
						<Image
							src={
								album.cover?.link ||
								urlUtil.getPlaceholderImage({
									text: album.name,
									width: 300,
									height: 300,
								})
							}
							alt={album.cover?.description || album.name}
							style={{ aspectRatio: '1', objectFit: 'cover' }}
							onClick={(e) => e.stopPropagation()}
						/>
					</Badge>
				}
				hoverable
				bodyStyle={{ padding: 8 }}
				actions={
					isCurrentUser
						? [
								<PrivacyDropdown
									key="privacy"
									disabled={!isCurrentUser}
									value={album.privacy}
									onChange={(privacy) => handleChangePrivacy(album, privacy)}
									render={(privacy) => <Button icon={<privacy.RIcon />} />}
								/>,
								<Button key="edit" icon={<HiPencil />} onClick={() => openAlbumModal(album)} />,
								<Popconfirm
									key="delete"
									title="Bạn có chắc muốn xóa album này?"
									onConfirm={handleDeleteAlbum}
								>
									<Button icon={<HiTrash />} danger />
								</Popconfirm>,
						  ]
						: []
				}
			>
				<Card.Meta
					title={
						<Link
							href={{
								pathname: router.pathname,
								query: { ...router.query, aid: album._id },
							}}
							shallow
							onClick={() => goToAlbum(album)}
						>
							{album.name}
						</Link>
					}
					description={dateUtil.getTimeAgo(album.createdAt)}
				/>
			</Card>
		);
	};

	return (
		<Card
			title="Bộ sưu tập"
			extra={
				isCurrentUser && (
					<Button type="primary" icon={<HiPlus />} onClick={() => openAlbumModal()}>
						Tạo mới
					</Button>
				)
			}
		>
			<AlbumModal open={modal === ModalType.ALBUM} onClose={closeModal} album={album} onSubmit={handleSubmit} />

			<List
				loading={albumFetcher.fetching}
				dataSource={albumFetcher.data}
				grid={{ gutter: 16, column: 3 }}
				renderItem={(item) => (
					<List.Item>
						<AlbumCard album={item} />
					</List.Item>
				)}
				loadMore={
					!albumFetcher.fetching &&
					albumFetcher.data.length > 0 && (
						<div style={{ textAlign: 'center', marginTop: 16 }}>
							<Button
								onClick={albumFetcher.loadMore}
								loading={albumFetcher.loadingMore}
								disabled={!albumFetcher.hasMore}
							>
								{albumFetcher.hasMore ? 'Xem thêm' : 'Hết rồi'}
							</Button>
						</div>
					)
				}
			/>
		</Card>
	);
}
