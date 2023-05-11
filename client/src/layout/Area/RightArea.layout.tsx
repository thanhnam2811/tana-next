import React, { ReactNode } from 'react';

import { Box, Grid, SxProps } from '@mui/material';

interface Props {
	[key: string]: any;

	children: ReactNode;
	fixed?: boolean;
}

export function RightArea({ children, fixed = false }: Props) {
	const fixedStyle: SxProps = fixed
		? {
				position: 'fixed',
				height: {
					xs: 'calc(100vh - 56px - 16px)',
					sm: 'calc(100vh - 64px - 16px)',
				},
				width: {
					lg: 3 / 12,
				},
				overflow: 'auto',
		  }
		: {};

	return (
		<Grid
			item
			lg={3}
			display={{
				xs: 'none',
				lg: 'block',
			}}
			width="100%"
		>
			<Box sx={{ ...fixedStyle }}>{children}</Box>
		</Grid>
	);
}
