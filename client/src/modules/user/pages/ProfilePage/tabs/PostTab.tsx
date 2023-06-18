import { useFetcher } from '@common/hooks';
import { PostType } from '@common/types';
import { CreatePost, ListPost } from '@modules/post/components';
import { useUserContext } from '@modules/user/hooks';
import styles from './PostTab.module.scss';
import { Button, Image, Tooltip, Typography, theme } from 'antd';
import { HiCamera, HiUserPlus } from 'react-icons/hi2';
import { UploadImage } from '@common/components/Button';
import { useAuth } from '@modules/auth/hooks';
import { toast } from 'react-hot-toast';
import { uploadFileApi } from '@common/api';
import { ReactNode } from 'react';

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

	const actions: ReactNode[] = [];

	if (!isCurrentUser) {
		switch (user.relationship) {
			case 'none':
				actions.push(
					<Button key="add-friend" type="primary" icon={<HiUserPlus />} onClick={console.log}>
						Kết bạn
					</Button>
				);
				break;
			case 'friend':
				actions.push(
					<Button key="unfriend" type="primary" onClick={console.log}>
						Bạn bè
					</Button>,
					<Button key="chat" onClick={console.log}>
						Nhắn tin
					</Button>
				);
				break;
			case 'sent':
				actions.push(
					<Button key="cancel-request" onClick={console.log}>
						Đã gửi lời mời
					</Button>
				);
				break;
			case 'received':
				actions.push(
					<Button key="accept-request" type="primary" onClick={console.log}>
						Chấp nhận
					</Button>,
					<Button key="decline-request" onClick={console.log} danger>
						Từ chối
					</Button>
				);
				break;
			default:
				break;
		}
	}

	console.log({ user, actions });

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
