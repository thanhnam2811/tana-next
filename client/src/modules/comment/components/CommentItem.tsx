import { UserAvatar } from '@modules/user/components';
import { ReactPopover } from 'src/common/components/Popover';
import { ReactionTypeValue } from '@common/types';
import { Collapse } from '@mui/material';
import { useAuth } from '@modules/auth/hooks';
import { Avatar, Button, List } from 'antd';
import { useState } from 'react';
import {
	HiOutlineChatBubbleLeft,
	HiOutlineExclamationTriangle,
	HiOutlineHandThumbUp,
	HiOutlineTrash,
} from 'react-icons/hi2';
import { CommentType } from '../types';
import { ListComment } from './ListComment';
import { dateUtil } from '@common/utils';
import { useReport } from '@modules/report/hooks';
import { PostType } from '@modules/post/types';

interface Props {
	post: PostType;
	comment: CommentType;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	onReact?: (id: string, reaction: ReactionTypeValue) => Promise<void> | void;
	isReply?: boolean;
}

export function CommentItem({ post, comment, onDelete, onReact, isReply = false }: Props) {
	const { authUser } = useAuth();
	const isPostAuthor = authUser?._id === post!.author._id;
	const isAuthor = authUser?._id === comment!.author._id;

	const [showReply, setShowReply] = useState(false);
	const toggleReply = () => setShowReply(!showReply);

	const handleReact = (react: ReactionTypeValue) => onReact?.(comment!._id, react);

	let actions = [
		<ReactPopover
			key="reaction"
			reaction={comment!.reactOfUser}
			onReact={handleReact}
			renderChildren={({ reaction, loading }) => (
				<Button
					icon={reaction ? <Avatar src={reaction?.img} /> : <HiOutlineHandThumbUp />}
					size="small"
					type="text"
					loading={loading}
				>
					{comment.numberReact}
				</Button>
			)}
		/>,
	];

	if (!isReply) {
		actions = [
			...actions,
			<Button key="reply" size="small" type="text" icon={<HiOutlineChatBubbleLeft />} onClick={toggleReply}>
				{comment.numberReply}
			</Button>,
		];
	}

	const { openReport } = useReport({ type: 'comment', id: comment._id });
	if (!isAuthor)
		actions = [
			...actions,
			<Button
				key="report"
				size="small"
				type="text"
				danger
				icon={<HiOutlineExclamationTriangle />}
				onClick={openReport}
			/>,
		];

	if (isAuthor || isPostAuthor) {
		actions = [
			...actions,
			<Button
				key="delete"
				size="small"
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
				extra={<span className="time-ago">{dateUtil.getTimeAgo(comment.createdAt)}</span>}
			>
				<List.Item.Meta
					avatar={<UserAvatar user={comment.author} size={48} />}
					title={comment.author.fullname}
					description={comment.content}
				/>
			</List.Item>

			{!isReply && (
				<Collapse in={showReply} mountOnEnter>
					<div style={{ padding: '0 16px 16px' }}>
						<ListComment post={post} comment={comment} />
					</div>
				</Collapse>
			)}
		</>
	);
}
