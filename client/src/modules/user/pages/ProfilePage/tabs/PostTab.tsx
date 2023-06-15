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

	return (
		<>
			{/* Header */}
			<div className={styles.header}>
				{/* Cover */}
				<div className={styles.cover_container}>
					<Image src={user.coverPicture.link} alt="cover" className={styles.cover} />

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
							src={user.profilePicture.link}
							alt="avatar"
							fallback="http://via.placeholder.com/160x160?text=Avatar"
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
						<div className={styles.actions}>
							{/* Follow */}
							<Button type="primary" icon={<HiUserPlus />}>
								Theo dõi
							</Button>

							{/* Message */}
							<Button>Nhắn tin</Button>

							{/* More */}
							<Button>...</Button>
						</div>
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
