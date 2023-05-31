import { reactOptions } from '@assets/data';
import { UserAvatar } from '@components/v2/Avatar';
import { ReactPopover } from '@components/v2/Popover';
import { CommentType, PostType, ReactionType } from '@interfaces';
import { Collapse } from '@mui/material';
import { useUserStore } from '@store';
import { getTimeAgo } from '@utils/common';
import { Avatar, Button, List } from 'antd';
import { useState } from 'react';
import { HiOutlineChatBubbleLeft, HiOutlineHandThumbUp, HiOutlineTrash } from 'react-icons/hi2';
import { CommentReply } from './CommentReply';

interface Props {
	post: PostType;
	comment: CommentType;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	onReact?: (id: string, reaction: ReactionType) => void;
	isReply?: boolean;
}

export function CommentItem({ post, comment, onDelete, onReact, isReply = false }: Props) {
	const { user } = useUserStore();
	const isPostAuthor = user!._id === post!.author._id;
	const isAuthor = user!._id === comment!.author._id;

	const [showReply, setShowReply] = useState(false);
	const toggleReply = () => setShowReply(!showReply);

	const reaction = reactOptions.find((react) => react.value === comment!.reactOfUser);
	const handleReact = (react: ReactionType) => onReact?.(comment!._id, react);

	let actions = [
		<ReactPopover key="reaction" reaction={reaction?.value} onReact={handleReact}>
			<Button
				icon={reaction ? <Avatar src={reaction?.img} /> : <HiOutlineHandThumbUp />}
				type="text"
				style={{ color: reaction?.color }}
			>
				{comment.numberReact}
			</Button>
		</ReactPopover>,
	];

	if (!isReply) {
		actions = [
			...actions,
			<Button key="reply" type="text" icon={<HiOutlineChatBubbleLeft />} onClick={toggleReply}>
				{comment.numberReply}
			</Button>,
		];
	}

	if (isAuthor || isPostAuthor) {
		actions = [
			...actions,
			<Button
				key="delete"
				type="text"
				danger
				icon={<HiOutlineTrash />}
				onClick={() => onDelete?.(comment._id)}
			/>,
		];
	}

	return (
		<>
			<List.Item
				style={{ borderBottom: '1px solid #e8e8e8' }}
				actions={actions}
				extra={<span className="time-ago">{getTimeAgo(comment.createdAt)}</span>}
			>
				<List.Item.Meta
					avatar={<UserAvatar user={comment.author} size={48} />}
					title={comment.author.fullname}
					description={comment.content}
				/>
			</List.Item>

			{!isReply && (
				<Collapse in={showReply} mountOnEnter>
					<CommentReply post={post} comment={comment} />
				</Collapse>
			)}
		</>
	);
}
