import { IUser } from '@interfaces';
import { ILoginParams, authApi, userApi } from '@utils/api';
import { create } from 'zustand';

interface IUserStore {
	user: IUser | null;
	setUser: (user: IUser) => void;
	login: (data: ILoginParams) => Promise<void>;
	logout: () => void;
	getProfile: () => Promise<void>;
	updateProfile: (data: Partial<IUser>) => Promise<IUser>;
}

export const useUserStore = create<IUserStore>()((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	login: async (data) => {
		const {
			data: { user },
		} = await authApi.login(data);
		user.isOnline = true; // Set user online
		set({ user });
	},
	logout: () => {
		authApi.logout();
		set({ user: null });
	},
	getProfile: async () => {
		const { data: user } = await authApi.getProfile();
		user.isOnline = true; // Set user online
		set({ user });
	},
	updateProfile: async (data: Partial<IUser>) => {
		const { data: user } = await userApi.update(data);
		set({ user });

		return user;
	},
}));
