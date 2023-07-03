import { useFetcher } from '@common/hooks';
import { CreatePost, ListPost } from '@modules/post/components';
import { useUserAction, useUserContext } from '@modules/user/hooks';
import styles from './PostTab.module.scss';
import { Button, Dropdown, Image, Popconfirm, theme, Tooltip, Typography } from 'antd';
import { HiCamera, HiExclamationTriangle, HiUserPlus } from 'react-icons/hi2';
import { UploadImage } from '@common/components/Button';
import { useAuth } from '@modules/auth/hooks';
import { toast } from 'react-hot-toast';
import { uploadMultiFileApi } from '@common/api';
import { ReactNode } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { useReport } from '@modules/report/hooks';
import { PostType } from '@modules/post/types';

export function PostTab() {
	const { token } = theme.useToken();

	const { updateAuthUser } = useAuth();
	const { user, isCurrentUser } = useUserContext();

	const postsFetcher = useFetcher<PostType>({ api: `/users/${user._id}/posts` });

	const handleChangeCover = async (file: File) => {
		const toastId = toast.loading('Đang tải ảnh lên...');

		try {
			const uploaded = await uploadMultiFileApi([file]);
			const coverPicture = uploaded.files[0];
			toast.success('Tải ảnh lên thành công!', { id: toastId });

			await updateAuthUser({ coverPicture: coverPicture._id }, { coverPicture });
			toast.success('Cập nhật ảnh bìa thành công!');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const handleChangeAvatar = async (file: File) => {
		const toastId = toast.loading('Đang tải ảnh lên...');

		try {
			const uploaded = await uploadMultiFileApi([file]);
			const profilePicture = uploaded.files[0];
			toast.success('Tải ảnh lên thành công!', { id: toastId });

			await updateAuthUser({ profilePicture: profilePicture._id }, { profilePicture });
			toast.success('Cập nhật ảnh đại diện thành công!');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const {
		relationship,
		loading,
		handleRequestFriend,
		handleCancelRequestFriend,
		handleAcceptFriend,
		handleUnfriend,
		handleChat,
		handleRejectFriend,
	} = useUserAction(user);

	const actions: ReactNode[] = [];

	if (!isCurrentUser) {
		switch (relationship) {
			case 'none':
				actions.push(
					<Button
						key="add-friend"
						type="primary"
						icon={<HiUserPlus />}
						onClick={handleRequestFriend}
						loading={loading.request}
					>
						Kết bạn
					</Button>
				);
				break;
			case 'friend':
				actions.push(
					<Dropdown
						key="friend"
						arrow
						trigger={['click']}
						menu={{
							items: [
								{
									key: 'unfriend',
									label: (
										<Popconfirm
											title="Bạn có chắc muốn hủy kết bạn?"
											okText="Đồng ý"
											cancelText="Hủy"
											onConfirm={handleUnfriend}
										>
											Hủy kết bạn
										</Popconfirm>
									),
									danger: true,
								},
							],
						}}
					>
						<Button type="primary">Bạn bè</Button>
					</Dropdown>,
					<Button key="chat" onClick={handleChat} loading={loading.chat}>
						Nhắn tin
					</Button>
				);
				break;
			case 'sent':
				actions.push(
					<Dropdown
						key="sent"
						arrow
						trigger={['click']}
						menu={{
							items: [
								{
									key: 'cancel',
									label: (
										<Popconfirm
											title="Bạn có chắc muốn hủy lời mời kết bạn?"
											okText="Đồng ý"
											cancelText="Hủy"
											onConfirm={handleCancelRequestFriend}
										>
											Hủy lời mời
										</Popconfirm>
									),
									danger: true,
								},
							],
						}}
					>
						<Button type="primary">Đã gửi lời mời</Button>
					</Dropdown>
				);
				break;
			case 'received':
				actions.push(
					<Button key="accept" type="primary" onClick={handleAcceptFriend} loading={loading.accept}>
						Chấp nhận
					</Button>,
					<Button key="reject" danger onClick={handleRejectFriend} loading={loading.reject}>
						Từ chối
					</Button>
				);
				break;
			default:
				break;
		}
	}

	const { openReport } = useReport({ type: 'user', id: user._id });
	if (!isCurrentUser)
		actions.push(
			<Dropdown
				key="more"
				arrow
				trigger={['click']}
				menu={{
					items: [
						{
							key: 'report',
							label: 'Báo cáo',
							danger: true,
							onClick: openReport,
							icon: <HiExclamationTriangle />,
						},
					],
				}}
			>
				<Button icon={<HiDotsHorizontal />} />
			</Dropdown>
		);

	return (
		<>
			{/* Header */}
			<div className={styles.header}>
				{/* Cover */}
				<div className={styles.cover_container}>
					<Image
						src={user.coverPicture?.link}
						alt="cover"
						className={styles.cover}
						fallback="http://via.placeholder.com/1600x900?text=Không có ảnh bìa"
						preview={!!user.coverPicture}
					/>

					{/* Action */}
					{isCurrentUser && (
						<div className={styles.cover_action}>
							<UploadImage
								cropProps={{
									zoomSlider: true,
									aspect: 16 / 9,
								}}
								onPickImage={handleChangeCover}
							>
								<Tooltip title="Đổi ảnh bìa">
									<Button shape="circle" icon={<HiCamera />} size="large" />
								</Tooltip>
							</UploadImage>
						</div>
					)}
				</div>

				{/* Content */}
				<div className={styles.bottom}>
					{/* Avatar */}
					<div className={styles.avatar_container}>
						<Image
							wrapperClassName={styles.avatar_wrapper}
							wrapperStyle={{ borderColor: token.colorBgLayout }}
							src={user.profilePicture?.link}
							alt="avatar"
							fallback="http://via.placeholder.com/160x160?text=Avatar"
							preview={!!user.profilePicture}
						/>

						{/* Action */}
						{isCurrentUser && (
							<UploadImage cropProps={{ zoomSlider: true }} onPickImage={handleChangeAvatar}>
								<Button className={styles.avatar_action} shape="circle" icon={<HiCamera />} />
							</UploadImage>
						)}
					</div>

					{/* Content */}
					<div className={styles.content}>
						{/* Name */}
						<Typography.Title level={3} className={styles.name}>
							{user.fullname}
						</Typography.Title>

						{/* Actions */}
						<div className={styles.actions}>{actions}</div>
					</div>
				</div>
			</div>

			{/* Body */}
			{isCurrentUser && <CreatePost fetcher={postsFetcher} />}

			{/* Content */}
			<ListPost fetcher={postsFetcher} />
		</>
	);
}
