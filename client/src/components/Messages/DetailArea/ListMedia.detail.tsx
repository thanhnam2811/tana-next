import { useFetcher } from '@common/hooks';
import { Box, CircularProgress, ImageList, ImageListItem, Typography } from '@mui/material';
import { isVideo } from '@utils/data';
import Image from 'next/image';
interface Props {
	conversation: any;
	handlePreviewMedia: (image: any) => void;
}

const ListMedia = ({ conversation, handlePreviewMedia }: Props) => {
	const mediaFetcher = useFetcher({ api: `conversations/${conversation?._id}/files/media` });
	const { data: listMedia, hasMore, fetching, loadMore } = mediaFetcher;

	if (mediaFetcher.fetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" m={2}>
				<CircularProgress />
			</Box>
		);
	}

	if (listMedia.length == 0 && !fetching)
		return (
			<Typography textAlign="center" color="text.secondary">
				Chưa có hình ảnh nào
			</Typography>
		);

	return (
		<ImageList
			cols={3}
			rowHeight={'auto'}
			sx={{
				'& li': {
					borderRadius: '8px',
					border: '1px solid #e0e0e0',
				},
				'& li:not(#load-more)': {
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '"Xem"',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						color: '#fff',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						fontSize: '14px',
						fontWeight: 'bold',
						opacity: 0,
						transition: 'all 0.3s ease',
						backdropFilter: 'blur(2px) brightness(0.4)',
						zIndex: 1,
					},
					'& > *': {
						width: '100%',
						objectFit: 'cover',
						aspectRatio: '1/1',
						transition: 'all 0.3s ease',
					},
					'&:hover': {
						cursor: 'pointer',
						border: '1px solid #1890ff',
						'& > *': {
							transform: 'scale(1.1)',
						},
						'&::before': {
							opacity: 1,
						},
					},
				},
			}}
		>
			{listMedia.map((media) => (
				<ImageListItem key={media._id} onClick={() => handlePreviewMedia(media)}>
					{isVideo(media) ? (
						<video src={media.link} />
					) : (
						<Image src={media.link} alt={media.originalName} width={300} height={300} />
					)}
				</ImageListItem>
			))}

			{/* Load more */}
			{hasMore && (
				<ImageListItem
					key="load-more"
					id="load-more"
					sx={{
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						transition: 'all 0.3s ease',
						'&:hover': {
							backgroundColor: '#e0e0e0',
						},
					}}
					onClick={loadMore}
				>
					{fetching ? (
						<CircularProgress size={24} />
					) : (
						<Typography fontSize={14} fontWeight={500} color="primary.main">
							Xem thêm
						</Typography>
					)}
				</ImageListItem>
			)}
		</ImageList>
	);
};

export default ListMedia;
