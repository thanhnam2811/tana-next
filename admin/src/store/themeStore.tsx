import { create } from 'zustand';

enum ColorsEnum {
	Primary = 'primary',
	Secondary = 'secondary',
	Success = 'success',
	Danger = 'danger',
	Warning = 'warning',
	Info = 'info',
}

enum BackgroundColorsEnum {
	Dark = 'dark',
	Light = 'light',
}

interface Theme {
	colors: Record<ColorsEnum, string>;
	bgColors: Record<BackgroundColorsEnum, string>;
}

const lightTheme: Theme = {
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

const darkTheme: Theme = {
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

interface ThemeStore {
	mode: 'light' | 'dark';
	theme: Theme;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()((set) => ({
	mode: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
	theme: lightTheme,
	toggleTheme: () => {
		set((state) => {
			localStorage.setItem('theme', state.mode === 'light' ? 'dark' : 'light');

			return {
				mode: state.mode === 'light' ? 'dark' : 'light',
				theme: state.theme === lightTheme ? darkTheme : lightTheme,
			};
		});
	},
}));
