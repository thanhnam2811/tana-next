import { create } from 'zustand';
import { ITheme } from '@layout/types';

export const useTheme = create<ITheme>()((set) => ({
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
