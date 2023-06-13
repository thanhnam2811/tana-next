import { useFetcher } from '@common/hooks';
import { Avatar, Box, CircularProgress, Dialog, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { stringUtil } from '@common/utils';
import { isVideo } from '@utils/data';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { HiDownload, HiX } from 'react-icons/hi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { dateUtil } from '@common/utils';

interface Props {
	open: boolean;
	onClose: () => void;
	mediaData: any;
}

export const MediaViewModal = ({ open, onClose, mediaData }: Props) => {
	const router = useRouter();
	const id = router.query.id as string;
	const fetcher = useFetcher({ api: `conversations/${id}/files/media` });
	const listMedia = fetcher.data;

	const [media, setMedia] = useState<any>(mediaData);

	// load more listMedia until find media when mediaPreview change and not find media in listMedia
	useEffect(() => {
		if (media) {
			const m: any = listMedia.find((item: any) => item._id == media._id);
			if (!m) fetcher.loadMore();
			else {
				setMedia(m); // update mediaPreview
				const mediaEl = document.getElementById(m._id);
				if (mediaEl) {
					mediaEl.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
			}
		}
	}, [media?._id, listMedia.length]);

	useEffect(() => {
		if (mediaData) setMedia(mediaData);
	}, [mediaData?._id]); // set media preview when media change

	const currIndex = listMedia?.findIndex((item: any) => item._id == media?._id);

	const oldMedia = () => {
		const nextIndex = currIndex + 1;
		if (nextIndex < listMedia.length) setMedia(listMedia[nextIndex]);
	};

	const newMedia = () => {
		const prevIndex = currIndex - 1;
		if (prevIndex >= 0) setMedia(listMedia[prevIndex]);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowUp') newMedia();
		else if (event.key === 'ArrowDown') oldMedia();
	};

	// keyboad event listener for next and prev media
	useEffect(() => {
		if (currIndex !== -1) {
			document.addEventListener('keydown', handleKeyDown);
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [currIndex]);

	const handleDownload = () => {
		window.open(media?.link, '_blank');
	};

	const handleClose = () => {
		onClose();
		setMedia(null);
	};

	return (
		<Dialog
			keepMounted
			fullScreen
			open={open}
			onClose={handleClose}
			sx={{
				backgroundColor: 'rgba(0, 0, 0, 0.4)',
				backdropFilter: 'blur(8px)',
				'& .MuiDialog-paper': {
					backgroundColor: 'transparent',
				},
			}}
			id="modal-view-media"
		>
			{/* Header */}
			<Stack direction="row" justifyContent="space-between" alignItems="center" p="8px" color="white">
				{/* Left */}
				<Stack direction="row">
					<Avatar src={media?.creator?.profilePicture?.link} alt={media?.creator?.fullname}>
						{stringUtil.getShortName(media?.creator?.fullname)}
					</Avatar>

					<Stack direction="column" justifyContent="space-between" ml="8px">
						<Typography fontSize={16} fontWeight={600}>
							{media?.creator?.fullname}
						</Typography>

						<Typography fontSize={12} fontWeight={400}>
							{dateUtil.getTimeAgo(media?.createdAt)}
						</Typography>
					</Stack>
				</Stack>

				{/* Right */}
				<Stack direction="row" alignItems="center" spacing={1}>
					<Tooltip title="Tải xuống">
						<IconButton onClick={handleDownload}>
							<HiDownload color="white" />
						</IconButton>
					</Tooltip>

					<Tooltip title="Đóng">
						<IconButton onClick={handleClose}>
							<HiX color="white" />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>

			{/* Body */}
			<Stack
				width="100%"
				height="100%"
				flex="1"
				bgcolor="transparent"
				overflow="hidden"
				direction="row"
				gap="8px"
				px={1}
			>
				{/* Preview */}
				<Box
					width="100%"
					height="100%"
					bgcolor="transparent"
					overflow="hidden"
					display="flex"
					justifyContent="center"
					alignItems="center"
					flex={1}
				>
					{isVideo(media) ? (
						<video src={media?.link} className="media-view" controls />
					) : (
						<Image
							src={media?.link}
							alt={media?.originalname}
							className="media-view"
							width={1}
							height={1}
						/>
					)}
				</Box>

				{/* Navigation */}
				<Stack
					height="100%"
					bgcolor="transparent"
					overflow="hidden"
					direction="column"
					justifyContent="center"
					alignItems="center"
					sx={{
						'& .MuiIconButton-root': {
							transition: 'all 0.2s ease-in-out',
							color: 'white',
							'&:hover': {
								transform: 'scale(1.1)',
								color: 'primary.main',
							},
							'&:disabled': {
								opacity: 0.4,
							},
						},
					}}
				>
					<IconButton onClick={newMedia} disabled={currIndex == 0}>
						<BsArrowUpCircle size={40} />
					</IconButton>

					<IconButton onClick={oldMedia} disabled={currIndex == listMedia.length - 1}>
						<BsArrowDownCircle size={40} />
					</IconButton>
				</Stack>

				{/*	List image	*/}
				<Box height="100%" width="200px" id="list-media-container" overflow="visible auto">
					<InfiniteScroll
						next={fetcher.loadMore}
						hasMore={fetcher.hasMore}
						loader={
							<div style={{ textAlign: 'center', padding: '16px' }}>
								{fetcher.fetching && <CircularProgress size={24} />}
							</div>
						}
						dataLength={listMedia?.length}
						scrollableTarget="list-media-container"
						style={{
							flexDirection: 'column',
							gap: '8px',
							overflowX: 'visible',
						}}
					>
						{listMedia?.map((file: any) => (
							<Box
								id={file._id}
								position="relative"
								className={`list-media-item-container ${file._id == media?._id ? 'active' : ''}`}
								key={file._id}
								onClick={() => setMedia(file)}
							>
								{isVideo(file) ? (
									<video className="list-media-item" src={file.link} />
								) : (
									<Image
										className="list-media-item"
										src={file.link}
										alt={file.originalname}
										width={1}
										height={1}
									/>
								)}
							</Box>
						))}
					</InfiniteScroll>
				</Box>
			</Stack>
		</Dialog>
	);
};
