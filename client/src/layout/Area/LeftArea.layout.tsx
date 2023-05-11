import React, { ReactNode } from 'react';

import { Box, Grid, SxProps } from '@mui/material';

interface Props {
	[key: string]: any;

	children: ReactNode;
	fixed?: boolean;
}

export function LeftArea({ children, fixed = false }: Props) {
	const fixedStyle: SxProps = fixed
		? {
				position: 'fixed',
				height: {
					xs: 'calc(100vh - 56px - 16px)',
					sm: 'calc(100vh - 64px - 16px)',
				},
				width: {
					md: 4 / 12,
					lg: 3 / 12,
				},
		  }
		: {};

	return (
		<Grid
			item
			md={4}
			lg={3}
			display={{
				xs: 'none',
				md: 'block',
			}}
			width="100%"
		>
			<Box sx={{ ...fixedStyle }}>{children}</Box>
		</Grid>
	);
}
