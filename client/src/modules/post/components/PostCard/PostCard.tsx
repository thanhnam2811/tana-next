import { reactOptions } from '@assets/data';
import { PrivacyDropdown } from '@components/Button';
import { UserAvatar } from '@components/v2/Avatar';
import { ReactPopover } from '@components/v2/Popover';
import { PostFormType, PostType } from '@interfaces';
import { ReactionType } from '@interfaces/common';
import { ListComment } from '@modules/comment/components';
import { Collapse } from '@mui/material';
import { getTimeAgo, randomNumber } from '@utils/common';
import { Avatar, Button, Card, Dropdown, MenuProps, Skeleton, Space } from 'antd';
import { useState } from 'react';
import { HiArchive, HiBell, HiDotsHorizontal, HiEyeOff, HiLink } from 'react-icons/hi';
import { HiOutlineChatBubbleLeft, HiOutlineHandThumbUp, HiOutlineShare, HiPencil, HiTrash } from 'react-icons/hi2';
import styles from './PostCard.module.scss';
import { PostContent } from './PostContent';
import { PostMedia } from './PostMedia';
import { useAuth } from '@modules/auth/hooks';

const { Meta } = Card;

interface Props {
	post?: PostType;
	onEdit?: (postId: string, data: PostFormType) => void;
	onDelete?: (postId: string) => void;
	onReact?: (postId: string, reaction: ReactionType) => void;
}

export function PostCard({ post, onEdit, onDelete, onReact }: Props) {
	const loading = !post;
	const { authUser } = useAuth();
	const [showComment, setShowComment] = useState(false);
	const toggleComment = () => setShowComment(!showComment);

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

	const isAuthor = authUser!._id === post!.author._id;
	const author = isAuthor ? authUser! : post!.author;

	const reaction = reactOptions.find((react) => react.value === post!.reactOfUser);
	const handleReact = (react: ReactionType) => onReact?.(post!._id, react);

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
				onClick: () => onDelete?.(post!._id),
			}
		);

	return (
		<Card bodyStyle={{ padding: 0 }} style={{ width: '100%' }}>
			<Card
				style={{ width: '100%' }}
				headStyle={{ padding: '0 16px' }}
				bodyStyle={{ padding: 16 }}
				bordered={false}
				extra={
					<Space>
						<PrivacyDropdown
							value={post!.privacy}
							disabled={!isAuthor}
							onChange={(privacy) => onEdit?.(post!._id, { privacy })}
						/>

						<Dropdown menu={menuProps} arrow trigger={['click']}>
							<Button type="text" icon={<HiDotsHorizontal />} />
						</Dropdown>
					</Space>
				}
				actions={[
					<ReactPopover key="reaction" reaction={reaction?.value} onReact={handleReact}>
						<Button
							icon={reaction ? <Avatar src={reaction?.img} /> : <HiOutlineHandThumbUp />}
							type="text"
							style={{ color: reaction?.color }}
						>
							{reaction?.label || 'Thích'}
						</Button>
					</ReactPopover>,
					<Button key="comment" icon={<HiOutlineChatBubbleLeft />} type="text" onClick={toggleComment}>
						Bình luận
					</Button>,
					<Button key="share" icon={<HiOutlineShare />} type="text">
						Chia sẻ
					</Button>,
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

			<Collapse in={showComment} mountOnEnter>
				<div style={{ padding: '0 16px 16px' }}>
					<ListComment post={post} />
				</div>
			</Collapse>
		</Card>
	);
}
