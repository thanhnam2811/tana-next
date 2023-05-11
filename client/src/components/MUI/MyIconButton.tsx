import { MouseEventHandler } from 'react';

import { Avatar, Badge, IconButton, SxProps, Tooltip, useTheme } from '@mui/material';
import { IconType } from 'react-icons/lib';

interface Props {
	[key: string]: any;
	tooltip?: string;
	placement?: 'top' | 'bottom' | 'left' | 'right';
	onClick: MouseEventHandler<HTMLButtonElement>;
	notifyCount?: number | string;
	Icon: IconType;
	size?: number;
	variant?: 'default' | 'color';
	sx?: SxProps;
}

export function MyIconButton({
	tooltip = '',
	placement = 'bottom',
	onClick,
	notifyCount,
	Icon,
	size,
	variant = 'default',
	sx = {},
}: Props) {
	const theme = useTheme();

	const styleList = {
		default: {
			backgroundColor: 'background.default',
			color: theme.palette.secondary.main,
		},
		color: {
			backgroundColor: '#1877f22f',
			color: theme.palette.primary.main,
		},
	};

	return (
		<IconButton onClick={onClick} sx={{ ...sx }}>
			<Tooltip disableHoverListener={!tooltip} title={tooltip} placement={placement}>
				<Badge max={99} color="error" overlap="circular" badgeContent={notifyCount}>
					<Avatar
						sx={{
							backgroundColor: styleList[variant].backgroundColor,
							backdropFilter: 'blur(10px)',
						}}
					>
						<Icon color={styleList[variant].color} size={size} />
					</Avatar>
				</Badge>
			</Tooltip>
		</IconButton>
	);
}
