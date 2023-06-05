import { create } from 'zustand';

interface ThemeStore {
	mode: 'light' | 'dark';
	toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>()((set) => ({
	mode: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
	toggleTheme: () => {
		set((state) => {
			localStorage.setItem('theme', state.mode === 'light' ? 'dark' : 'light');

			return {
				mode: state.mode === 'light' ? 'dark' : 'light',
			};
		});
	},
}));
