import { DraftViewer } from '@components/Editor';
import { Box, Button, Grid, Typography, Skeleton } from '@mui/material';
import { randomNumber } from '@utils/common';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';

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
	post: any;
}

export function PostContent({ post }: Props) {
	const postContentRef = useRef<HTMLDivElement>(null);
	const [isShowMore, setIsShowMore] = useState(false);
	const { clientHeight, scrollHeight } = postContentRef?.current || {};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const isContentHasMore = useMemo(() => clientHeight !== scrollHeight, [postContentRef?.current]);

	const handleShowMoreContent = () => {
		const postContent = document.getElementById(`post-content-${post._id}`);
		const postContentContainer = document.getElementById(`post-content-container-${post._id}`);
		if (postContent && postContentContainer) {
			postContentContainer.style.maxHeight = postContentRef?.current?.scrollHeight + 'px';
			postContent.style.webkitLineClamp = 'initial';
		}
		setIsShowMore(true);
	};

	const handleCollapseContent = () => {
		const postContent = document.getElementById(`post-content-${post._id}`);
		const postContentContainer = document.getElementById(`post-content-container-${post._id}`);
		if (postContent && postContentContainer) {
			postContentContainer.style.maxHeight = `${MAX_HEIGHT}px`;
			setTimeout(() => {
				postContent.style.webkitLineClamp = '5';
			}, TRANSITION_DURATION);
		}
		setIsShowMore(false);
	};

	return (
		<Box>
			<Box
				sx={{
					maxHeight: `${MAX_HEIGHT}px`,
					overflow: 'hidden',
					transition: `max-height ${TRANSITION_DURATION}ms ease-in-out`,
				}}
				ref={postContentRef}
				id={`post-content-container-${post._id}`}
			>
				<Typography
					id={`post-content-${post._id}`}
					sx={{
						lineHeight: `${LINE_HEIGHT}px`,
						textOverflow: 'ellipsis',
						wordBreak: 'break-word',
						lineClamp: '5',
						WebkitLineClamp: '5',
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						'& .sun-editor .se-wrapper .se-wrapper-inner': {
							minHeight: 'unset',
							p: 0,
							overflow: 'visible',
						},
						'& .sun-editor .se-toolbar': {
							outline: 'none',
						},
						'& .sun-editor': {
							outline: 'none',
							border: 'none',
						},
					}}
					component="div"
				>
					<DraftViewer content={post.content} />
				</Typography>
			</Box>
			{/* Button read more */}
			{(isContentHasMore || isShowMore) && (
				<Button
					sx={{
						mt: 1,
						p: 0,
						color: 'primary.main',
						display: 'block',
					}}
					onClick={() => {
						if (isShowMore) handleCollapseContent();
						else handleShowMoreContent();
					}}
				>
					<Typography variant="caption">{isShowMore ? 'Thu gọn' : 'Xem thêm'}</Typography>
				</Button>
			)}

			{/* Post image */}
			{post.image?.length > 0 && (
				<Grid container spacing={1} sx={{ mt: 1 }} justifyContent={'center'}>
					{post.image?.slice(0, 6).map((item: string, index: number) => (
						<Grid
							item
							xs={getColumnSize(index, post.image?.length)}
							key={index}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Box position="relative" style={{ width: 'auto', height: 'auto' }}>
								<Image
									src={item}
									alt="Post Image"
									fill
									style={{
										objectFit: 'cover',
										borderRadius: '16px',
										maxWidth: '100%',
										maxHeight: '60vh',
									}}
								/>
								{/*	Overlayer last image if image.length > 6 */}
								{post.image?.length > 6 && index === 5 && (
									<Box
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											height: '100%',
											backgroundColor: 'rgba(0,0,0,0.5)',
											borderRadius: '16px',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Typography color="white">+{post.image?.length - 6}</Typography>
									</Box>
								)}
							</Box>
						</Grid>
					))}
				</Grid>
			)}
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
