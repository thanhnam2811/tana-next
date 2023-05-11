import { WhiteBox } from '@components/Box';
import { ReactionType } from '@components/Popup';
import { useAuth } from '@hooks';
import { Avatar, Box, Collapse, Divider, IconButton, Typography, Skeleton, BoxProps } from '@mui/material';
import { getShortName, getTimeAgo } from '@utils/common';
import { useEffect, useRef, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { PostAction, PostComment, PostContent, PostContentSkeleton, PostFooter, PostFooterSkeleton } from '.';

interface Props {
	post: any;
	// eslint-disable-next-line no-unused-vars
	handleReact: (postId: string, reactionType: ReactionType) => any;
}

export function PostCard({ post, handleReact, ...rest }: Props & BoxProps) {
	const moreActionRef = useRef<any>();

	const { user } = useAuth();
	const [author, setAuthor] = useState<any>(post.author);
	useEffect(() => {
		if (author._id === user?._id) {
			setAuthor(user);
		}
	}, [author._id, user]);

	const [showComment, setShowComment] = useState(false);
	const handleToggleComment = () => setShowComment(!showComment);

	return (
		<WhiteBox sx={{ mb: 2, p: 2, pb: 1, height: 'fit-content', boxShadow: 1 }} {...rest}>
			{/* Post header */}
			<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
				{/* Avatar and name */}
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Avatar sx={{ width: 50, height: 50 }} alt="Profile Picture" src={author?.profilePicture?.link}>
						{getShortName(author?.fullname)}
					</Avatar>
					<Box sx={{ marginLeft: '8px' }}>
						<Typography variant="h6">{author?.fullname}</Typography>
						<Typography variant="caption">{getTimeAgo(post.createdAt, 30)}</Typography>
					</Box>
				</Box>

				{/* More */}
				<IconButton sx={{ marginLeft: 'auto' }} ref={moreActionRef}>
					<HiDotsHorizontal size={18} />
				</IconButton>

				<PostAction anchorElRef={moreActionRef} />
			</Box>

			<Divider sx={{ my: 1, mx: -2 }} />

			{/* Post content */}
			<PostContent post={post} />

			{/* Post footer */}
			<PostFooter post={post} handleToggleComment={handleToggleComment} handleReact={handleReact} />

			<Collapse in={showComment} mountOnEnter>
				<Divider sx={{ mx: -2, my: 1 }} />
				<PostComment post={post} />
			</Collapse>
		</WhiteBox>
	);
}

export const PostCardSkeleton = () => (
	<WhiteBox sx={{ mb: 1, p: 2, pb: 1, height: 'fit-content', boxShadow: 1 }}>
		{/* Post header */}
		<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
			{/* Avatar and name */}
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Skeleton variant="circular" width={50} height={50} />
				<Box sx={{ marginLeft: '8px' }}>
					<Skeleton variant="text" width={100} />
					<Skeleton variant="text" width={100} />
				</Box>
			</Box>

			{/* More */}
			<IconButton sx={{ marginLeft: 'auto' }}>
				<HiDotsHorizontal size={18} />
			</IconButton>
		</Box>

		<Divider sx={{ my: 1, mx: -2 }} />

		{/* Post content */}
		<PostContentSkeleton />

		{/* Post footer */}
		<PostFooterSkeleton />
	</WhiteBox>
);
