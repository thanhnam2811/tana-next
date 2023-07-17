import { AlbumFormType, AlbumType } from '@modules/user/types';
import useSWR from 'swr';
import { deleteFileApi, swrFetcher, updateFileApi, uploadFileApi } from '@common/api';
import { Button, Card, Image, List, Popconfirm, Space, Spin, Tooltip } from 'antd';
import { useSWRFetcher } from '@common/hooks';
import { IFile, IPrivacy, MediaType } from '@common/types';
import { useAuth } from '@modules/auth/hooks';
import { HiArrowLeft, HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';
import { HiDownload } from 'react-icons/hi';
import React, { useState } from 'react';
import { AlbumModal } from '@modules/user/components/AlbumModal';
import { toast } from 'react-hot-toast';
import { updateAlbumApi } from '@modules/user/api/updateAlbum.api';
import { PrivacyDropdown } from '@common/components/Button';
import { MediaModal } from '@modules/user/components/MediaModal';
import { deleteAlbumApi } from '@modules/user/api/deleteAlbum.api';
import { MediaCard } from '@modules/user/components/MediaCard';

enum ModalType {
	ALBUM,
	MEDIA,
}

interface Props {
	id: string;
	onUpdate?: (album: AlbumType) => Promise<void>;
	onDelete?: (id: string) => Promise<void>;
	onBack?: () => Promise<void>;
}

export function AlbumDetail({ id, onUpdate, onBack, onDelete }: Props) {
	const { authUser } = useAuth();
	const { data: album, isLoading, mutate, error } = useSWR<AlbumType>(`/albums/${id}`, swrFetcher);

	const [modal, setModal] = useState<ModalType>();
	const closeModal = () => setModal(undefined);
	const openAlbumModal = () => setModal(ModalType.ALBUM);
	const openMediaModal = () => setModal(ModalType.MEDIA);

	if (!album) {
		if (isLoading) return <Spin />;

		if (error) return <Card title="Lỗi khi tải album">{error.message || error.toString()}</Card>;

		return <Card title="Không tìm thấy album">Album này không tồn tại hoặc đã bị xóa!</Card>;
	}

	const ownerId = typeof album.author === 'string' ? album.author : album.author._id;
	const isOwner = ownerId === authUser?._id;

	const handleSubmit = async (data: AlbumFormType) => {
		const toastId = toast.loading('Đang cập nhật album....');

		try {
			const updated = await updateAlbumApi(album._id, data);
			await mutate(updated, false);
			await onUpdate?.(updated);

			toast.success('Cập nhật album thành công', { id: toastId });
			closeModal();
		} catch (error) {
			toast.error(`Cập nhật album thất bại! ${error}`, { id: toastId });
		}
	};

	const handleChangePrivacy = async (privacy: IPrivacy) => {
		const toastId = toast.loading('Đang thay đổi quyền riêng tư...');

		try {
			const updated = await updateAlbumApi(album._id, { privacy });
			await mutate(updated, false);
			await onUpdate?.(updated);

			toast.success('Thay đổi quyền riêng tư thành công', { id: toastId });
			closeModal();
		} catch (error) {
			toast.error(`Thay đổi quyền riêng tư thất bại! ${error}`, { id: toastId });
		}
	};

	const handleDeleteAlbum = async () => {
		const toastId = toast.loading('Đang xóa album...');

		try {
			await deleteAlbumApi(album._id);
			await onDelete?.(album._id);
			await onBack?.();

			toast.success('Xóa album thành công', { id: toastId });
		} catch (error) {
			toast.error(`Xóa album thất bại! ${error}`, { id: toastId });
		}
	};

	return (
		<Card
			title={
				<Space>
					<Button icon={<HiArrowLeft />} shape="circle" type="text" onClick={onBack} />

					{album.name}
				</Space>
			}
			extra={
				<Space>
					<PrivacyDropdown
						value={album.privacy}
						onChange={handleChangePrivacy}
						disabled={!isOwner}
						render={(privacy) => <Button icon={<privacy.RIcon />} />}
					/>

					<Tooltip title="Tải xuống">
						<Button type="primary" icon={<HiDownload />} disabled />
					</Tooltip>

					{isOwner && (
						<Tooltip title="Chỉnh sửa">
							<Button icon={<HiPencil />} onClick={openAlbumModal} />
						</Tooltip>
					)}

					{isOwner && (
						<Popconfirm title="Bạn có chắc muốn xóa album này?" onConfirm={handleDeleteAlbum}>
							<Tooltip title="Xóa">
								<Button danger icon={<HiTrash />} />
							</Tooltip>
						</Popconfirm>
					)}

					{isOwner && (
						<Tooltip title="Thêm ảnh vào album">
							<Button type="primary" icon={<HiPlus />} onClick={openMediaModal} />
						</Tooltip>
					)}
				</Space>
			}
		>
			<AlbumModal open={modal === ModalType.ALBUM} onClose={closeModal} album={album} onSubmit={handleSubmit} />

			<ListMedia
				id={album._id}
				isOwner={isOwner}
				modal={{ open: modal === ModalType.MEDIA, onClose: closeModal }}
			/>
		</Card>
	);
}

interface ListMediaProps {
	id: string;
	isOwner: boolean;
	modal: {
		open: boolean;
		onClose: () => void;
	};
}

const ListMedia = ({ id, isOwner, modal }: ListMediaProps) => {
	const mediaFetcher = useSWRFetcher<IFile>({ api: `/albums/${id}/medias`, limit: 12 });

	const handleSubmitMedia = async (medias: MediaType[]) => {
		const toastId = toast.loading(`Đang thêm ảnh vào album... (0/${medias.length})`);

		try {
			const files = [];
			const errors = [];

			await Promise.all(
				medias.map(async (item) => {
					try {
						const data = {
							album: id,
							description: item.description,
						};
						const file = await uploadFileApi(item.file!, data);
						files.push(file);
						mediaFetcher.addData(file);

						toast.loading(`Đang thêm ảnh vào album... (${files.length}/${medias.length})`, { id: toastId });
					} catch (error) {
						errors.push(error);
					}
				})
			);

			const numSuccess = files.length;
			const numError = errors.length;

			toast.success(
				`Thêm ảnh vào album thành công! (${numSuccess}/${medias.length}) ${
					numError > 0 ? `(${numError} lỗi)` : ''
				}`,
				{ id: toastId }
			);
			modal.onClose();
		} catch (error) {
			toast.error(`Thêm ảnh vào album thất bại! ${error}`, { id: toastId });
		}
	};

	const handleDeleteMedia = async (id: string) => {
		const toastId = toast.loading('Đang xóa ảnh khỏi album...');

		try {
			await deleteFileApi(id);
			await mediaFetcher.removeData(id);

			toast.success('Xóa ảnh khỏi album thành công', { id: toastId });
		} catch (error) {
			toast.error(`Xóa ảnh khỏi album thất bại! ${error}`, { id: toastId });
		}
	};

	const handleEditMedia = async (id: string, media: MediaType) => {
		const toastId = toast.loading('Đang cập nhật ảnh...');

		try {
			const updated = await updateFileApi(id, {
				description: media.description,
			});
			await mediaFetcher.updateData(id, updated);
			closeCardModal();

			toast.success('Cập nhật ảnh thành công', { id: toastId });
		} catch (error) {
			toast.error(`Cập nhật ảnh thất bại! ${error}`, { id: toastId });
		}
	};

	const [cardModal, setCardModal] = useState<{ open: boolean; media?: IFile }>({ open: false });
	const openCardModal = (media: IFile) => setCardModal({ open: true, media });
	const closeCardModal = () => setCardModal({ open: false });

	return (
		<Image.PreviewGroup>
			<MediaModal open={modal.open} onClose={modal.onClose} onSubmit={handleSubmitMedia} />
			<MediaCard.EditModal
				open={cardModal.open}
				onClose={closeCardModal}
				media={cardModal.media!}
				onSubmit={handleEditMedia}
			/>

			<List
				grid={{ gutter: 16, column: 3 }}
				dataSource={mediaFetcher.data}
				loading={mediaFetcher.fetching}
				renderItem={(item) => (
					<List.Item>
						<MediaCard media={item} isOwner={isOwner} onDelete={handleDeleteMedia} onEdit={openCardModal} />
					</List.Item>
				)}
				loadMore={
					!mediaFetcher.fetching &&
					mediaFetcher.data.length > 0 && (
						<div style={{ textAlign: 'center', marginTop: 16 }}>
							<Button
								onClick={mediaFetcher.loadMore}
								loading={mediaFetcher.loadingMore}
								disabled={!mediaFetcher.hasMore}
							>
								{mediaFetcher.hasMore ? 'Xem thêm' : 'Hết rồi'}
							</Button>
						</div>
					)
				}
			/>
		</Image.PreviewGroup>
	);
};
