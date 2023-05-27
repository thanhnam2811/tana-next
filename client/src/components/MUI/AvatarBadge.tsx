import { IUser } from '@interfaces';
import { Avatar, AvatarProps, Badge, BadgeProps, useTheme } from '@mui/material';
import { getShortName } from '@utils/common';
import { useRouter } from 'next/router';

interface Props {
	active: boolean;
	size?: number;
}

export const AvatarBadge = ({ active, size = 64, ...props }: Props & BadgeProps) => {
	const theme = useTheme();

	return (
		<Badge
			overlap="circular"
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			variant="dot"
			invisible={!active}
			sx={{
				height: 'fit-content',
				'& .MuiBadge-badge': {
					width: size / 4,
					height: size / 4,
					borderRadius: '50%',
					backgroundColor: '#44b700',
					color: '#44b700',
					boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
					'&::after': {
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						borderRadius: '50%',
						animation: 'ripple 1.2s infinite ease-in-out',
						border: '1px solid currentColor',
						content: '""',
					},
				},
			}}
			{...props}
		/>
	);
};

interface UserAvatarProps {
	user: IUser;
	size: number;
	badgeProps?: BadgeProps;
}

export const UserAvatar = ({ user, size, badgeProps, ...props }: UserAvatarProps & AvatarProps) => {
	const router = useRouter();
	const goToProfile = () => router.push(`/profile?id=${user._id}`);

	return (
		<AvatarBadge active={user.isOnline} size={size} {...badgeProps}>
			<Avatar
				sx={{
					width: size,
					height: size,
					cursor: 'pointer',
					transition: 'all 0.3s ease-in-out',
					'&:hover': {
						transform: 'scale(1.05)',
					},
					...props?.sx,
				}}
				alt={user.fullname}
				src={user.profilePicture.link}
				onClick={goToProfile}
				{...props}
			>
				{getShortName(user.fullname)}
			</Avatar>
		</AvatarBadge>
	);
};
