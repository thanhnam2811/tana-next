import { Box, Grid } from '@mui/material';
import { BoxProps } from '@mui/system';

export const CenterArea = (props: BoxProps) => (
	<Grid item xs height="100%">
		<Box height="100%" width="100%" mx="auto" {...props} />
	</Grid>
);
