import { UserFormType, UserType } from '@interfaces';
import { ILoginParams, authApi, userApi } from '@utils/api';
import { create } from 'zustand';

interface IUserStore {
	user: UserType | null;
	setUser: (user: UserType) => void;
	login: (data: ILoginParams) => Promise<void>;
	logout: () => void;
	getProfile: () => Promise<void>;
	updateProfile: (data: UserFormType, optimisticData?: Partial<UserType>) => Promise<void>;
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
	updateProfile: async (data, optimisticData) => {
		// Save rollback data
		const prev = get().user!;

		// Get optimistic data if not provided
		optimisticData ??= {
			...data,
			profilePicture: prev.profilePicture, // Keep old profile picture
			coverPicture: prev.coverPicture, // Keep old cover picture
		};

		// Optimistic update
		set({ user: { ...prev, ...optimisticData } });

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
