import { create } from 'zustand';
import { darkTheme, lightTheme } from '../data/theme.data';
import { ITheme } from '../types/them.type';

interface ThemeStore {
	mode: 'light' | 'dark';
	theme: ITheme;
	toggleTheme: () => void;
}

const useThemeStore = create<ThemeStore>()((set) => ({
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

export default useThemeStore;
