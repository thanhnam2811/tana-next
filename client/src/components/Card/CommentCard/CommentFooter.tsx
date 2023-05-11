import { reactionData, ReactionType, ReactPopup } from '@components/Popup';
import { useAuth } from '@hooks';
import { Stack, Typography } from '@mui/material';
import { getTimeAgo } from '@utils/common';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface Props {
	comment: any;
	isReply?: boolean;
	// eslint-disable-next-line no-unused-vars
	handleDelete: () => Promise<void>;
	showReply: boolean;
	toggleShowReply: () => void;
	// eslint-disable-next-line no-unused-vars
	onReact: (reaction: ReactionType) => Promise<void>;
}

export function CommentFooter({ comment, isReply = false, handleDelete, showReply, toggleShowReply, onReact }: Props) {
	const { user } = useAuth();
	const { author, createdAt, reactOfUser } = comment;
	const isAuthor = user?._id === author._id;

	const [anchorReact, setAnchorReact] = useState<null | HTMLElement>(null);
	const openReact = Boolean(anchorReact);
	const handleCloseReact = () => {
		setAnchorReact(null);
	};
	const hoverRef = useRef<any>();
	const handleMouseEnterReact = (event: React.MouseEvent<HTMLElement>) => {
		const target = event.currentTarget;
		hoverRef.current = setTimeout(() => {
			setAnchorReact(target);
		}, 1000); // 1s
	};
	const handleMouseLeaveReact = () => {
		clearTimeout(hoverRef.current);
		setAnchorReact(null);
	};

	const reactData = reactionData[reactOfUser as ReactionType];

	const handleReactClick = async (reaction: ReactionType) => {
		clearTimeout(hoverRef.current);
		handleCloseReact();
		await onReact(reaction);
	};

	return (
		<Stack
			mt={1}
			direction="row"
			spacing={1}
			sx={{
				'& .MuiTypography-root': {
					fontSize: 12,
					fontWeight: 600,
					'&:hover': {
						cursor: 'pointer',
						color: '#1976d2',
					},
				},
			}}
		>
			<Typography
				onClick={() => handleReactClick(reactData?.type || 'like')}
				onMouseEnter={handleMouseEnterReact}
				onMouseLeave={handleMouseLeaveReact}
				component="span"
				sx={{
					color: reactData?.color,
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<ReactPopup
					open={openReact}
					handleClose={handleCloseReact}
					handleReact={handleReactClick}
					anchorEl={anchorReact}
					size="small"
				/>

				{reactData && (
					<Image
						src={reactData.icon}
						alt={reactData.label}
						width={16}
						height={16}
						style={{ marginRight: 4 }}
					/>
				)}

				{reactData?.label || 'Thích'}
			</Typography>

			{!isReply && <Typography onClick={toggleShowReply}>{showReply ? 'Ẩn trả lời' : 'Trả lời'}</Typography>}

			{isAuthor && <Typography onClick={handleDelete}>Xóa</Typography>}

			<Typography ml="auto !important">{getTimeAgo(createdAt)}</Typography>
		</Stack>
	);
}
