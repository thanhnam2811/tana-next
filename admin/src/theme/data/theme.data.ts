import { BackgroundColorsEnum, ColorsEnum, ITheme } from '../types/IThemeStore';

export const lightTheme: ITheme = {
	colors: {
		[ColorsEnum.Primary]: '#007bff',
		[ColorsEnum.Secondary]: '#6c757d',
		[ColorsEnum.Success]: '#28a745',
		[ColorsEnum.Danger]: '#dc3545',
		[ColorsEnum.Warning]: '#ffc107',
		[ColorsEnum.Info]: '#17a2b8',
	},
	bgColors: {
		[BackgroundColorsEnum.Dark]: '#f8f9fa',
		[BackgroundColorsEnum.Light]: '#ffffff',
	},
};

export const darkTheme: ITheme = {
	colors: {
		[ColorsEnum.Primary]: '#007bff',
		[ColorsEnum.Secondary]: '#6c757d',
		[ColorsEnum.Success]: '#28a745',
		[ColorsEnum.Danger]: '#dc3545',
		[ColorsEnum.Warning]: '#ffc107',
		[ColorsEnum.Info]: '#17a2b8',
	},
	bgColors: {
		[BackgroundColorsEnum.Dark]: '#212529',
		[BackgroundColorsEnum.Light]: '#343a40',
	},
};
