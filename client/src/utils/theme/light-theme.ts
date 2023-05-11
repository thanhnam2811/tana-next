import { createTheme } from '@mui/material';
import { commonTheme } from './common';

export const lightTheme = createTheme({
	...commonTheme,
	palette: {
		mode: 'light',
		primary: {
			main: '#1877f2',
		},
		secondary: {
			main: '#a1aebe',
		},
		background: {
			default: '#f8f9fa',
		},
	},
});
