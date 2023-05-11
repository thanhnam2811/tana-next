import { reactionData, ReactionType, ReactPopup } from '@components/Popup';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, styled, Typography, Skeleton } from '@mui/material';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { RiChat1Line, RiShareForwardLine, RiThumbUpLine } from 'react-icons/ri';

const FooterButton = styled(LoadingButton)({
	width: '100%',
	transition: 'all 0.3s ease-in-out',
	'&:hover': {
		transform: 'scale(1.05)',
	},
});

interface Props {
	post: any;
	handleToggleComment: () => void;
	// eslint-disable-next-line no-unused-vars
	handleReact: (postId: string, reactionType: ReactionType) => Promise<void>;
}

export function PostFooter({ post, handleToggleComment, handleReact }: Props) {
	const [anchorReact, setAnchorReact] = useState<null | HTMLElement>(null);
	const openReact = Boolean(anchorReact);
	const handleOpenReact = (target: HTMLElement) => setAnchorReact(target);
	const handleCloseReact = () => setAnchorReact(null);

	const hoverRef = useRef<any>();
	const handleMouseEnterReact = (event: React.MouseEvent<HTMLElement>) => {
		const target = event.currentTarget;
		hoverRef.current = setTimeout(() => {
			handleOpenReact(target);
		}, 1000); // 1s
	};
	const handleMouseLeaveReact = () => {
		clearTimeout(hoverRef.current);
		handleCloseReact();
	};

	const reactData = reactionData[post.reactOfUser as ReactionType];

	const [reacting, setReacting] = useState(false); // Loading state
	const handleReactClick = async (reaction: ReactionType) => {
		clearTimeout(hoverRef.current);
		handleCloseReact();
		setReacting(true);
		await handleReact(post._id, reaction);
		setReacting(false);
	};

	return (
		<Box sx={{ mt: 2 }}>
			<Divider sx={{ mx: -2 }} />
			<Stack direction="row" spacing={2}>
				{/* Number of reactions */}
				{post.numberReact > 0 && (
					<Typography variant="caption" color="text.secondary">
						<strong>{post.numberReact}</strong> cảm xúc
					</Typography>
				)}

				{/* Number of comments */}
				{post.numberComment > 0 && (
					<Typography variant="caption" color="text.secondary">
						<strong>{post.numberComment}</strong> bình luận
					</Typography>
				)}

				{/* Number of shares */}
				{post.numberShare > 0 && (
					<Typography ml="auto" color="text.secondary">
						{post.numberShare} chia sẻ
					</Typography>
				)}
			</Stack>
			<Divider sx={{ mx: -2 }} />
			{/* Like, comment, share */}
			<Stack direction="row" sx={{ mt: 1 }} spacing={1}>
				<FooterButton
					color="secondary"
					loading={reacting}
					loadingPosition="start"
					startIcon={
						reactData ? (
							<Image src={reactData.icon} alt={reactData.label} width={20} height={20} />
						) : (
							<RiThumbUpLine size={20} />
						)
					}
					sx={{ color: reactData?.color, bgcolor: `${reactData?.color}20` }}
					onClick={() => handleReactClick(reactData?.type || 'like')}
					onMouseEnter={handleMouseEnterReact}
					onMouseLeave={handleMouseLeaveReact}
				>
					<ReactPopup
						open={openReact}
						handleClose={handleCloseReact}
						handleReact={handleReactClick}
						anchorEl={anchorReact}
						reacted={post.reactOfUser}
					/>
					<Typography variant="caption">{reactData?.label || 'Thích'}</Typography>
				</FooterButton>

				<FooterButton color="secondary" startIcon={<RiChat1Line size={20} />} onClick={handleToggleComment}>
					<Typography variant="caption">Bình luận</Typography>
				</FooterButton>
				<FooterButton color="secondary" startIcon={<RiShareForwardLine size={20} />}>
					<Typography variant="caption">Chia sẻ</Typography>
				</FooterButton>
			</Stack>
		</Box>
	);
}

export const PostFooterSkeleton = () => (
	<Box sx={{ mt: 2 }}>
		<Divider sx={{ mx: -2 }} />
		<Stack direction="row" spacing={2}>
			<Skeleton variant="text" width={100} />
			<Skeleton variant="text" width={100} />
			<Skeleton variant="text" width={100} />
		</Stack>
		<Divider sx={{ mx: -2 }} />
		<Stack direction="row" sx={{ mt: 1 }} spacing={1}>
			<FooterButton color="secondary" startIcon={<RiThumbUpLine size={20} />}>
				<Typography variant="caption">Thích</Typography>
			</FooterButton>
			<FooterButton color="secondary" startIcon={<RiChat1Line size={20} />}>
				<Typography variant="caption">Bình luận</Typography>
			</FooterButton>
			<FooterButton color="secondary" startIcon={<RiShareForwardLine size={20} />}>
				<Typography variant="caption">Chia sẻ</Typography>
			</FooterButton>
		</Stack>
	</Box>
);
