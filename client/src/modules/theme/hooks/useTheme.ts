import { create } from 'zustand';

interface ThemeStore {
	mode: 'light' | 'dark';
	getTheme: () => void; //  get theme from local storage
	toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>()((set) => ({
	mode: 'light',
	getTheme: () => {
		const theme = localStorage.getItem('theme');
		if (theme) {
			set({ mode: theme === 'dark' ? 'dark' : 'light' });
		}
	},
	toggleTheme: () => {
		set((state) => {
			localStorage.setItem('theme', state.mode === 'light' ? 'dark' : 'light');

			return {
				mode: state.mode === 'light' ? 'dark' : 'light',
			};
		});
	},
}));
