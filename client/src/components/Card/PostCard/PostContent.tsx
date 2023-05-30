import { DraftViewer } from '@components/Editor';
import { IPost } from '@interfaces';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { randomNumber } from '@utils/common';
import { useEffect, useRef, useState } from 'react';
import { PostMedia } from './PostMedia';
import { IMedia } from '@interfaces/common';

const LINE_HEIGHT = 24; // Height of each line of post content
const MAX_HEIGHT = 5 * LINE_HEIGHT; // Max height of post content
const TRANSITION_DURATION = 500; // Duration of transition

// Layout for image
const getColumnSize = (index: number, size: number) => {
	if (size === 1) return 12;
	if (size === 2 || size === 4) return 6;
	if (size === 5) return index < 2 ? 6 : 4; // 6, 6, 4, 4, 4
	return 4;
};

interface Props {
	post: PostType;
}

export function PostContent({ post }: Props) {
	const postContentRef = useRef<HTMLDivElement>(null);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			const postContentEl = postContentRef?.current;
			if (!postContentEl) return;

			const { clientHeight, scrollHeight } = postContentEl;
			if (clientHeight && scrollHeight) {
				console.log({ clientHeight, scrollHeight });
				setHasMore(scrollHeight > clientHeight);
			}
		}, 0); // Delay to get clientHeight and scrollHeight
	}, []);

	const handleShowMoreContent = () => {
		const postContentEl = postContentRef?.current;

		if (!postContentEl) return;

		postContentEl.style.maxHeight = `${postContentEl.scrollHeight}px`;
		setHasMore(false);
	};

	return (
		<Box>
			{/* Post content */}
			<Box
				sx={{
					maxHeight: `${MAX_HEIGHT}px`,
					overflow: 'hidden',
					transition: `max-height ${TRANSITION_DURATION}ms ease-in-out`,
					position: 'relative',
				}}
				ref={postContentRef}
			>
				<DraftViewer content={post.content} />

				{/* Button read more */}
				{hasMore && (
					<Box
						sx={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							zIndex: 1,
							fontWeight: 'bold',
							width: '100%',
							backgroundImage: 'linear-gradient(to right, transparent, white)',
						}}
					>
						<Typography
							sx={{
								cursor: 'pointer',
								color: 'black',
								fontWeight: 'bold',
								float: 'right',
								'&:hover': {
									color: 'primary.main',
								},
							}}
							variant="caption"
							onClick={handleShowMoreContent}
						>
							...Xem thêm
						</Typography>
					</Box>
				)}
			</Box>

			{/* Post media */}
			{post.media?.length > 0 && <PostMedia media={post.media} />}
		</Box>
	);
}

export const PostContentSkeleton = () => {
	const imageLength = randomNumber(0, 6);

	return (
		<Box>
			<Box sx={{ maxHeight: `${MAX_HEIGHT}px`, overflow: 'hidden' }}>
				<Skeleton variant="rounded" height={MAX_HEIGHT} />
			</Box>

			{/* Post image */}
			<Grid container spacing={1} sx={{ mt: 1 }} justifyContent={'center'}>
				{[...Array(imageLength)].map((item, index) => (
					<Grid item xs={getColumnSize(index, imageLength)} key={index}>
						<Skeleton variant="rounded" height={MAX_HEIGHT} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};
