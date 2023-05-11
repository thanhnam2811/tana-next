import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';

interface Props {
	children: ReactNode;
}

export const ContainerArea = ({ children }: Props) => (
	<Grid container m={0} p={1} flexWrap="nowrap" gap={2} minHeight="100%">
		{children}
	</Grid>
);
