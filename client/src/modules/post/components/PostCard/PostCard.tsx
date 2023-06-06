import { reactOptions } from '@assets/data';
import { PrivacyDropdown } from '@components/Button';
import { UserAvatar } from '@modules/user/components';
import { ReactPopover, SharePopover } from '@components/v2/Popover';
import { IPrivacy, PostType } from '@common/types';
import { ReactionType } from '@common/types/common';
import { useAuth } from '@modules/auth/hooks';
import { getTimeAgo, randomNumber } from '@utils/common';
import { Avatar, Button, Card, Dropdown, MenuProps, Skeleton, Space } from 'antd';
import Link from 'next/link';
import { HiArchive, HiBell, HiDotsHorizontal, HiEyeOff, HiLink } from 'react-icons/hi';
import {
	HiOutlineArrowTopRightOnSquare,
	HiOutlineChatBubbleLeft,
	HiOutlineHandThumbUp,
	HiOutlineShare,
	HiPencil,
	HiTrash,
} from 'react-icons/hi2';
import styles from './PostCard.module.scss';
import { PostContent } from './PostContent';
import { PostMedia } from './PostMedia';
import { deletePostApi, reactToPostApi, updatePostApi } from '@modules/post/api';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { urlUtil } from '@common/utils';

const { Meta } = Card;

interface Props {
	post?: PostType;
	onUpdate?: (postId: string, data: PostType) => void;
	onDelete?: (postId: string) => void;
	onCommentClick?: () => void;
	openNewTab?: boolean;
}

export function PostCard({ post: initPost, onUpdate, onDelete, onCommentClick, openNewTab }: Props) {
	const [post, setPost] = useState<PostType | undefined>(initPost);
	const link = urlUtil.getFullUrl(`/post/${post?._id}`);

	useEffect(() => {
		setPost(initPost);
	}, [initPost]);

	const loading = !post;
	const { authUser } = useAuth();

	const menuProps: MenuProps = {
		items: [
			{
				key: 'archive',
				icon: <HiArchive />,
				label: 'Lưu bài viết',
				onClick: () => console.log('Lưu bài viết'),
			},
			{
				key: 'subscribe',
				icon: <HiBell />,
				label: 'Theo dõi bài viết',
				onClick: () => console.log('Theo dõi bài viết'),
			},
			{
				key: 'hide',
				icon: <HiEyeOff />,
				label: 'Ẩn bài viết',
				onClick: () => console.log('Ẩn bài viết'),
			},
			{
				key: 'copy',
				icon: <HiLink />,
				label: 'Sao chép liên kết',
				onClick: () => console.log('Sao chép liên kết'),
			},
		],
	};

	if (loading)
		return (
			<Card>
				<Skeleton active avatar paragraph={{ rows: randomNumber(1, 4) }} />
			</Card>
		);

	const isAuthor = authUser?._id === post!.author._id;
	const author = isAuthor ? authUser! : post!.author;

	const reaction = reactOptions.find((react) => react.value === post!.reactOfUser);

	// React to the post
	const handleReact = async (react: ReactionType) => {
		try {
			const reacted = await reactToPostApi(post!._id, react);

			onUpdate?.(post!._id, reacted);

			setPost(reacted);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// Change privacy of the post
	const handlePrivacyChange = async (privacy: IPrivacy) => {
		try {
			const updated = await updatePostApi(post!._id, { privacy });

			onUpdate?.(post!._id, updated);

			setPost(updated);

			toast.success('Đã thay đổi quyền riêng tư của bài viết');
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// Delete the post
	const handleDelete = async () => {
		try {
			await deletePostApi(post!._id);

			onDelete?.(post!._id);

			toast.success('Đã xóa bài viết');
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	if (isAuthor)
		menuProps.items!.push(
			{
				key: 'edit',
				icon: <HiPencil />,
				label: 'Chỉnh sửa bài viết',
				onClick: () => console.log('Chỉnh sửa bài viết'),
			},
			{
				key: 'delete',
				icon: <HiTrash />,
				label: 'Xóa bài viết',
				onClick: handleDelete,
			}
		);

	return (
		<Card
			style={{ width: '100%' }}
			headStyle={{ padding: '0 16px' }}
			bodyStyle={{ padding: 16 }}
			bordered={false}
			extra={
				<Space>
					{openNewTab && (
						<Link href={`/post/${post!._id}`} target="_blank" rel="noopener noreferrer" passHref>
							<Button type="text" icon={<HiOutlineArrowTopRightOnSquare />} />
						</Link>
					)}

					{authUser && (
						<PrivacyDropdown value={post!.privacy} disabled={!isAuthor} onChange={handlePrivacyChange} />
					)}

					<Dropdown menu={menuProps} arrow trigger={['click']}>
						<Button type="text" icon={<HiDotsHorizontal />} />
					</Dropdown>
				</Space>
			}
			actions={[
				<ReactPopover
					key="reaction"
					reaction={reaction?.value}
					onReact={handleReact}
					trigger={authUser ? 'click' : []} // Disable trigger if user is not logged in
				>
					<Button
						icon={reaction ? <Avatar src={reaction?.img} /> : <HiOutlineHandThumbUp />}
						type="text"
						style={{ color: reaction?.color }}
						disabled={!authUser} // Disable if user is not logged in
					>
						{reaction?.label || 'Thích'}
					</Button>
				</ReactPopover>,
				<Button
					key="comment"
					icon={<HiOutlineChatBubbleLeft />}
					type="text"
					onClick={onCommentClick}
					disabled={!authUser} // Disable if user is not logged in
				>
					Bình luận
				</Button>,
				<SharePopover link={link} key="share">
					<Button icon={<HiOutlineShare />} type="text">
						Chia sẻ
					</Button>
				</SharePopover>,
			]}
			title={
				<Meta
					avatar={<UserAvatar user={author} avtSize={48} />}
					title={author.fullname}
					description={<span className="time-ago">{getTimeAgo(post!.createdAt)}</span>}
					className={styles.meta}
				/>
			}
		>
			<PostContent post={post!} />

			<PostMedia media={post!.media} />
		</Card>
	);
}
