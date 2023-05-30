import { WhiteBox } from '@components/Box';
import { UserAvatar } from '@components/MUI';
import { ReactionType } from '@components/Popup';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import { Box, BoxProps, Collapse, Divider, IconButton, Skeleton, Typography } from '@mui/material';
import { useUserStore } from '@store';
import { getTimeAgo } from '@utils/common';
import { useRouter } from 'next/router';
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

	const router = useRouter();
	const { user } = useUserStore();
	const [author, setAuthor] = useState<any>(post.author);
	const isMyPost = author._id === user?._id;

	useEffect(() => {
		if (isMyPost) {
			setAuthor(user);
		}
	}, [isMyPost, user]);

	const [showComment, setShowComment] = useState(false);
	const handleToggleComment = () => setShowComment(!showComment);

	const handleOpenPost = () => {
		router.push(`/post/${post._id}`);
	};

	return (
		<WhiteBox sx={{ mb: 2, p: 2, pb: 1, height: 'fit-content', boxShadow: 1 }} {...rest}>
			{/* Post header */}
			<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
				{/* Avatar and name */}
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<UserAvatar size={48} user={author} />

					<Box sx={{ marginLeft: '8px' }}>
						<Typography variant="h6" fontWeight={700}>
							{author?.fullname}
						</Typography>
						<Typography variant="caption">{getTimeAgo(post.createdAt, 30)}</Typography>
					</Box>
				</Box>

				{/* Open */}
				<IconButton sx={{ marginLeft: 'auto' }} onClick={handleOpenPost}>
					<OpenInNewRounded sx={{ width: 18, height: 18 }} />
				</IconButton>

				{/* More */}
				<IconButton ref={moreActionRef}>
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
		<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
			{/* Avatar and name */}
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Skeleton variant="circular" width={48} height={48} />
				<Box sx={{ marginLeft: '8px' }}>
					<Skeleton variant="text" width={100} />
					<Skeleton variant="text" width={100} />
				</Box>
			</Box>

			{/* Open */}
			<IconButton sx={{ marginLeft: 'auto' }}>
				<OpenInNewRounded sx={{ width: 18, height: 18 }} />
			</IconButton>

			{/* More */}
			<IconButton>
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
