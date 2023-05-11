import React from 'react';
import { Avatar, Box, IconButton, Popper, Stack, Tooltip } from '@mui/material';
import Reaction from '@assets/icons/reactions';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
export const reactionData: Record<ReactionType, { type: ReactionType; color: string; icon: any; label: string }> = {
	like: {
		color: '#1976d2',
		icon: Reaction.Like.src,
		label: 'Thích',
		type: 'like',
	},
	love: {
		color: '#e91e63',
		icon: Reaction.Love.src,
		label: 'Yêu thích',
		type: 'love',
	},
	haha: {
		color: '#ff9800',
		icon: Reaction.Haha.src,
		label: 'Haha',
		type: 'haha',
	},
	wow: {
		color: '#ffeb3b',
		icon: Reaction.Wow.src,
		label: 'Wow',
		type: 'wow',
	},
	sad: {
		color: '#424848',
		icon: Reaction.Sad.src,
		label: 'Buồn',
		type: 'sad',
	},
	angry: {
		color: '#f44336',
		icon: Reaction.Angry.src,
		label: 'Phẫn nộ',
		type: 'angry',
	},
};

interface Props {
	open: boolean;
	handleClose: () => void;
	// eslint-disable-next-line no-unused-vars
	handleReact: (type: ReactionType) => Promise<void>;
	anchorEl: any;
	reacted?: ReactionType;
	size?: 'small' | 'medium';
}

const sizeMap = {
	small: 24,
	medium: 32,
};

export const ReactPopup = ({ open, handleReact, anchorEl, reacted, size = 'medium' }: Props) => {
	const renderReaction = ([key, { label, color, icon }]: [string, { color: string; icon: any; label: string }]) => {
		const isReacted = reacted === key;
		return (
			<Tooltip title={isReacted ? 'Hủy' : label} key={key} placement="top">
				<IconButton
					key={key}
					onClick={(e) => {
						e.stopPropagation();
						return handleReact(key as ReactionType);
					}}
					sx={{
						p: 0.5,
						'&:hover, &.active': {
							backgroundColor: `${color}40`,
							'& img': {
								animation: 'shack 1s ease-in-out',
							},
						},
						overflow: 'visible',
						transition: 'all .5s ease-in-out',
					}}
					className={isReacted ? 'active' : ''}
				>
					<Avatar
						sx={{
							width: sizeMap[size],
							height: sizeMap[size],
							overflow: 'visible',
						}}
						src={icon}
					/>
				</IconButton>
			</Tooltip>
		);
	};

	return (
		<Popper
			sx={{
				zIndex: 1,
			}}
			open={open}
			anchorEl={anchorEl}
			placement="top"
			modifiers={[
				{
					name: 'flip',
					enabled: false,
					options: {
						altBoundary: true,
						rootBoundary: 'viewport',
						padding: 8,
					},
				},
				{
					name: 'preventOverflow',
					enabled: true,
					options: {
						altAxis: true,
						altBoundary: false,
						tether: true,
						rootBoundary: 'viewport',
						padding: 8,
					},
				},
			]}
		>
			<Box bgcolor="white" boxShadow={4} p="4px" borderRadius="20px">
				<Stack direction="row" spacing="4px">
					{/* List reaction */}
					{Object.entries(reactionData).map(renderReaction)}
				</Stack>
			</Box>
		</Popper>
	);
};
