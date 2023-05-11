import { Badge, BadgeProps, styled } from '@mui/material';

const CustomBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		width: '16px',
		height: '16px',
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
}));

interface Props {
	active: boolean;
}

export const AvatarBadge = ({ active, ...props }: Props & BadgeProps) => (
	<CustomBadge
		overlap="circular"
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		variant="dot"
		invisible={!active}
		{...props}
	/>
);
