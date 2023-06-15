import { useFetcher } from '@common/hooks';
import { PostType } from '@common/types';
import { CreatePost, ListPost } from '@modules/post/components';
import { useUserContext } from '@modules/user/hooks';
import styles from './PostTab.module.scss';
import { Button, Image } from 'antd';
import { HiCamera, HiUserPlus } from 'react-icons/hi2';

export function PostTab() {
	const { user, isCurrentUser } = useUserContext();

	const postsFetcher = useFetcher<PostType>({ api: `/users/${user._id}/posts` });

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
							<Button shape="circle" icon={<HiCamera />} size="large" />
						</div>
					)}
				</div>

				{/* Content */}
				<div className={styles.bottom}>
					{/* Avatar */}
					<div className={styles.avatar_container}>
						<Image className={styles.avatar} src={user.profilePicture.link} alt="avatar" />

						{/* Action */}
						{isCurrentUser && (
							<div className={styles.avatar_action}>
								<Button shape="circle" icon={<HiCamera />} size="large" />
							</div>
						)}
					</div>

					{/* Content */}
					<div className={styles.content}>
						{/* Name */}
						<div className={styles.name}>{user.fullname}</div>

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
