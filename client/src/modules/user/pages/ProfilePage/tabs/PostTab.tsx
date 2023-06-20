import { useFetcher } from '@common/hooks';
import { PostType } from '@common/types';
import { CreatePost, ListPost } from '@modules/post/components';
import { useUserContext } from '@modules/user/hooks';
import styles from './PostTab.module.scss';
import { Button, Image, Tooltip, Typography, theme, Dropdown, Popconfirm } from 'antd';
import { HiCamera, HiUserPlus } from 'react-icons/hi2';
import { UploadImage } from '@common/components/Button';
import { useAuth } from '@modules/auth/hooks';
import { toast } from 'react-hot-toast';
import { uploadFileApi } from '@common/api';
import { ReactNode, useState } from 'react';
import { requestFriendApi, unFriendApi } from '@modules/friend/api';
import { createConversationApi } from '@modules/messages/api';
import { useRouter } from 'next/router';

export function PostTab() {
	const { token } = theme.useToken();

	const { updateAuthUser } = useAuth();
	const { user, isCurrentUser } = useUserContext();

	const postsFetcher = useFetcher<PostType>({ api: `/users/${user._id}/posts` });

	const handleChangeCover = async (file: File) => {
		const toastId = toast.loading('Đang tải ảnh lên...');

		try {
			const uploaded = await uploadFileApi([file]);
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
			const uploaded = await uploadFileApi([file]);
			const profilePicture = uploaded.files[0];
			toast.success('Tải ảnh lên thành công!', { id: toastId });

			await updateAuthUser({ profilePicture: profilePicture._id }, { profilePicture });
			toast.success('Cập nhật ảnh đại diện thành công!');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	const [relationship, setRelationship] = useState(user.relationship);
	const [loading, setLoadingState] = useState<{ [key: string]: boolean }>({});
	const setLoading = (key: string, value: boolean) => setLoadingState((prev) => ({ ...prev, [key]: value }));

	const handleRequestFriend = async () => {
		const toastId = toast.loading('Đang gửi lời mời kết bạn...');
		setLoading('request', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Gửi lời mời kết bạn thành công!', { id: toastId });
			setRelationship('sent');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('request', false);
	};

	const handleUnfriend = async () => {
		const toastId = toast.loading('Đang hủy kết bạn...');
		setLoading('unfriend', true);

		try {
			await unFriendApi(user._id);
			toast.success('Hủy kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('unfriend', false);
	};

	const router = useRouter();
	const handleChat = async () => {
		const toastId = toast.loading('Đang chuyển hướng đến trang nhắn tin...');
		setLoading('chat', true);

		try {
			const created = await createConversationApi({ members: [{ user: user._id }] });
			await router.push(`/messages?id=${created._id}`);

			toast.dismiss(toastId);
		} catch (error) {
			toast('Có lỗi xảy ra, vui lòng thử lại sau', { id: toastId });
		}

		setLoading('chat', false);
	};

	const handleAcceptFriend = async () => {
		const toastId = toast.loading('Đang xác nhận lời mời kết bạn...');
		setLoading('accept', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Xác nhận lời mời kết bạn thành công! Bạn bè với nhau rồi đó!', { id: toastId });
			setRelationship('friend');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('accept', false);
	};

	const handleRejectFriend = async () => {
		const toastId = toast.loading('Đang từ chối lời mời kết bạn...');
		setLoading('reject', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Từ chối lời mời kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('reject', false);
	};

	const handleCancelRequestFriend = async () => {
		const toastId = toast.loading('Đang hủy lời mời kết bạn...');
		setLoading('cancel', true);

		try {
			await requestFriendApi(user._id); // Request friend again to cancel
			toast.success('Hủy lời mời kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('cancel', false);
	};

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
