import { Alert, Avatar, Box, Chip, Divider, Grid, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { stringUtil, randomBoolean, randomNumber, renderHTML } from '@utils/common';
import { getFilePreview, isImage, isVideo } from '@utils/data';
import styles from './MessageArea.module.css';
import Image from 'next/image';

interface Props {
	text: string;
	other?: boolean;
	sender?: any;
	combine?: {
		prev: boolean;
		next: boolean;
	};
	isSystem?: boolean;
	sending?: boolean;
	media?: any[];
	error?: string;
	// eslint-disable-next-line no-unused-vars
	onMediaPreview: (media: any) => void;
}

export function MessageItem({
	text,
	other,
	sender = {
		user: {},
	},
	combine = {
		prev: false,
		next: false,
	},
	isSystem = false,
	sending = false,
	media = [],
	error = undefined,
	onMediaPreview,
}: Props) {
	const getPropsFile = (file: any) => {
		const isMedia = isImage(file) || isVideo(file);
		return isMedia
			? {
					onClick: () => onMediaPreview(file),
			  }
			: {
					component: 'a',
					href: file.link,
					download: true,
			  };
	};

	if (isSystem)
		return (
			<Box display="flex" justifyContent="center" width="100%" p="8px">
				<Chip
					sx={{ maxWidth: '60%' }}
					variant="outlined"
					color="primary"
					label={
						<Tooltip title={stringUtil.renderHTML(text)} placement="top">
							<Typography textOverflow="ellipsis" overflow="hidden">
								{stringUtil.renderHTML(text)}
							</Typography>
						</Tooltip>
					}
				/>
			</Box>
		);

	const { user, nickname } = sender;

	const renderMedia = () => {
		if (media.length === 0) return null;

		if (media.length === 1 && isImage(media[0])) {
			return (
				<Box className={styles['message-media']}>
					<Image
						src={getFilePreview(media[0])}
						alt={media[0].name}
						onClick={() => onMediaPreview(media[0])}
						loading="lazy"
						width={100}
						height={100}
					/>
				</Box>
			);
		} else if (media.length === 1 && isVideo(media[0])) {
			return (
				<Box className={styles['message-media']}>
					<video src={getFilePreview(media[0])} onClick={() => onMediaPreview(media[0])} />
				</Box>
			);
		}

		return (
			<Stack direction="column" width="100%">
				{media.map((file, index) => (
					<Stack
						key={index}
						direction="row"
						spacing={1}
						sx={{
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
							},
							p: 1,
							borderRadius: '8px',
							mx: -0.5,
							'& img, & video': {
								width: 60,
								height: 60,
								objectFit: 'cover',
								minWidth: 60,
								borderRadius: '8px',
							},
							textDecoration: 'none',
							color: 'inherit',
						}}
						{...getPropsFile(file)}
					>
						{isVideo(file) ? (
							<video src={getFilePreview(file)} />
						) : (
							<Image loading="lazy" src={getFilePreview(file)} alt={file.name} width={60} height={60} />
						)}
						<Typography textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" sx={{ flex: 1 }}>
							{file.originalname || file.name}
						</Typography>
					</Stack>
				))}
			</Stack>
		);
	};

	const renderError = () => {
		if (!error) return null;
		return (
			<Box
				position="absolute"
				top="0"
				right="0"
				zIndex={1}
				sx={{
					backgroundColor: 'rgba(0, 0, 0, 0.2)',
					backdropFilter: 'blur(4px)',
					borderRadius: 'inherit',
				}}
				display="flex"
				alignItems="center"
				justifyContent="center"
				width="100%"
				height="100%"
			>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	};

	return (
		// Container
		<Grid
			className={styles['message-item']}
			component="div"
			container
			width="100%"
			gap="8px"
			pt={combine.next ? '1px' : '8px'}
			pb={combine.prev ? '1px' : '8px'}
			px={2}
			justifyContent={other ? 'flex-start' : 'flex-end'}
		>
			{/* Avatar */}
			{other && (
				<Grid
					component="div"
					item
					xs="auto"
					visibility={!combine.prev ? 'visible' : 'hidden'}
					display="flex"
					flexDirection="column"
					justifyContent="flex-end"
				>
					<Avatar
						sx={{
							width: '32px',
							height: '32px',
						}}
						alt={nickname || user?.fullname}
						src={user?.profilePicture?.link}
					>
						{stringUtil.getShortName(user?.fullname)}
					</Avatar>
				</Grid>
			)}
			{/* Message */}
			<Grid component="div" item xs="auto" width="fit-content !important" maxWidth="80% !important">
				<Box
					position="relative"
					borderRadius={
						other
							? combine.next
								? '4px 16px 16px 4px'
								: '16px 16px 16px 4px'
							: combine.next
							? '16px 4px 4px 16px'
							: '16px 16px 4px 16px'
					}
					py="8px"
					px="12px"
					sx={{
						backgroundColor: other ? 'background.default' : 'primary.main',
						color: other ? 'black' : 'white',
						animation: sending ? 'sending-message 1s infinite' : 'none',
					}}
				>
					{renderError()}
					{renderMedia()}
					{media?.length && text ? <Divider color="white" sx={{ my: 1 }} /> : null}
					<Typography
						fontSize={16}
						fontWeight={500}
						sx={{
							overflowWrap: 'anywhere',
						}}
					>
						{text}
					</Typography>
				</Box>
			</Grid>
		</Grid>
	);
}

export const MessageItemSkeleton = () => {
	const other = randomBoolean();
	const messageWidth = randomNumber(50, 100);

	return (
		<Grid
			className={styles['message-item']}
			component="div"
			container
			width="100%"
			gap="8px"
			pt="8px"
			pb="8px"
			px={2}
			justifyContent={other ? 'flex-start' : 'flex-end'}
		>
			{other && (
				<Grid component="div" item xs="auto" display="flex" flexDirection="column" justifyContent="flex-end">
					<Skeleton variant="circular" width={32} height={32} />
				</Grid>
			)}

			<Grid component="div" item xs="auto" width="fit-content !important" maxWidth="80% !important">
				<Box
					borderRadius={other ? '16px 16px 16px 4px' : '16px 16px 4px 16px'}
					py="8px"
					px="12px"
					sx={{
						backgroundColor: other ? 'background.default' : 'primary.main',
						color: other ? 'black' : 'white',
					}}
				>
					<Skeleton variant="text" width={messageWidth} />
				</Box>
			</Grid>
		</Grid>
	);
};
