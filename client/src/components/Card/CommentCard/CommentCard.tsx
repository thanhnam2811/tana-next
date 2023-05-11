import { ListComment } from '@components/List/ListComment';
import { ReactionType } from '@components/Popup';
import { useInfiniteFetcher } from '@hooks';
import { Avatar, Box, CircularProgress, Collapse, Stack, Typography, StackProps } from '@mui/material';
import { getShortName } from '@utils/common';
import { useState } from 'react';
import { CommentFooter } from '.';

interface Props {
	post: any;
	comment: any;
	isReply?: boolean;
	// eslint-disable-next-line no-unused-vars
	handleDelete: (commentId: string) => any;
	// eslint-disable-next-line no-unused-vars
	handleReact: (commentId: string, react: ReactionType) => any;
}

export const CommentCard = ({
	post,
	comment,
	isReply = false,
	handleDelete,
	handleReact,
	...rest
}: Props & StackProps) => {
	const { author, content } = comment;

	const [showReply, setShowReply] = useState(false);
	const toggleShowReply = () => setShowReply(!showReply);

	const [deleting, setDeleting] = useState(false);
	const onDelete = async () => {
		setDeleting(true);
		await handleDelete(comment._id);
		setDeleting(false);
	};

	const replyFetcher = useInfiniteFetcher(`posts/${post._id}/comments/${comment._id}/replies`);

	const onReact = (react: ReactionType) => handleReact(comment._id, react);

	return (
		<Stack
			spacing={1}
			direction="row"
			{...rest}
			sx={{
				borderRadius: '16px',
				border: '1px solid #e0e0e0',
				padding: '8px',
				my: 1,
				position: 'relative',
				...rest.sx,
			}}
		>
			<Avatar sx={{ width: 32, height: 32 }} src={author?.profilePicture?.link} alt={author?.fullname}>
				{getShortName(author?.fullname)}
			</Avatar>
			<Stack flex={1} overflow="hidden">
				<Typography fontSize={14} fontWeight={800}>
					{author?.fullname}
				</Typography>

				<Typography
					variant="caption"
					textOverflow="ellipsis"
					sx={{
						overflowWrap: 'break-word',
						overflow: 'hidden',
					}}
				>
					{content}
				</Typography>

				<CommentFooter
					comment={comment}
					handleDelete={onDelete}
					isReply={isReply}
					showReply={showReply}
					toggleShowReply={toggleShowReply}
					onReact={onReact}
				/>

				<Collapse in={showReply} mountOnEnter>
					<ListComment fetcher={replyFetcher} post={post} comment={comment} />
				</Collapse>
			</Stack>

			<Box
				sx={{
					position: 'absolute',
					top: 0,
					right: 0,
					width: '100%',
					height: '100%',
					zIndex: 1,
					pointerEvents: deleting ? 'all' : 'none',
					opacity: deleting ? 1 : 0,
					transition: 'all 0.3s ease-in-out',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '16px',
					backdropFilter: 'blur(2px) brightness(0.6)',
					gap: 1,
				}}
			>
				<CircularProgress size={24} sx={{ color: 'white' }} />
				<Typography variant="caption" color="white">
					Đang xóa...
				</Typography>
			</Box>
		</Stack>
	);
};
