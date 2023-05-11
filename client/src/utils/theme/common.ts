import { createTheme, responsiveFontSizes } from '@mui/material';

export const stockTheme = createTheme();

const shadows = stockTheme.shadows;
shadows[1] = '0 20px 27px 0 rgb(0 0 0 / 5%)';

export const commonTheme = createTheme({
	typography: {
		fontWeightBold: 800,
		fontWeightMedium: 700,
		fontWeightRegular: 500,
		fontWeightLight: 400,
		h3: {
			fontWeight: 700,
		},
		h6: {
			fontWeight: 600,
			fontSize: '1.125rem',
		},
	},
	shadows: shadows,
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
	},
	shape: {
		borderRadius: 12,
	},
});

export const getTheme = (mode: 'light' | 'dark') => {
	const theme = createTheme({
		...commonTheme,
		palette: {
			mode: mode,
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

	return responsiveFontSizes(theme, {
		factor: 100,
	});
};
