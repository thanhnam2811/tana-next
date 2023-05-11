import React from 'react';
import { Grid, Typography } from '@mui/material';
import { IconType } from 'react-icons/lib';
import { MyIconButton } from '@components/MUI';

interface Props {
	action: {
		label: string;
		icon: IconType;
		onClick: () => any | Promise<any>;
	};
}

export function ActionItem({ action }: Props) {
	return (
		<Grid component="div" item xs display="flex" alignItems="center" flexDirection="column">
			{/* Action Button */}
			<MyIconButton variant="color" Icon={action.icon} onClick={() => action.onClick()} />
			{/* Action Title */}
			<Typography
				sx={{
					mt: '-6px',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
					maxWidth: '100%',
				}}
				variant="subtitle2"
			>
				{action.label}
			</Typography>
		</Grid>
	);
}
