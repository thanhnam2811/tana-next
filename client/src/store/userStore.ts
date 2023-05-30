import { UserType } from '@interfaces';
import { ILoginParams, authApi, userApi } from '@utils/api';
import { create } from 'zustand';

interface IUserStore {
	user: UserType | null;
	setUser: (user: UserType) => void;
	login: (data: ILoginParams) => Promise<void>;
	logout: () => void;
	getProfile: () => Promise<void>;
	updateProfile: (data: Partial<UserType>) => Promise<void>;
}

export const useUserStore = create<IUserStore>()((set, get) => ({
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
	updateProfile: async (data: Partial<UserType>) => {
		// Save rollback data
		const prev = get().user!;

		// Optimistic update
		set({ user: { ...prev, ...data } });

		try {
			// Update to server
			const { data: user } = await userApi.update(data);
			set({ user });
		} catch (error) {
			// Rollback if error
			set({ user: prev });
			throw error;
		}
	},
}));
