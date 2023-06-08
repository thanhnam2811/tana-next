import { create } from 'zustand';
import { darkTheme, lightTheme } from '../data/theme.data';
import { IThemeStore } from '../types/IThemeStore';

export const useThemeStore = create<IThemeStore>()((set) => ({
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
