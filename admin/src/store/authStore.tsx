import { IUser } from '@/interface';
import { create } from 'zustand';

interface AuthStore {
	isAuth: boolean;
	user: IUser | null;
	login: (user: IUser) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
	isAuth: false,
	user: null,
	login: (user: IUser) => set({ isAuth: true, user }),
	logout: () => set({ isAuth: false, user: null }),
}));
