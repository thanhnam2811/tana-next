import { create } from 'zustand';
import { loginApi, loginTokenApi, updateProfileApi } from '../api';
import { IUseAuth } from '../types';

export const useAuth = create<IUseAuth>()((set, get) => ({
	authUser: null,

	setAuthUser: (user) => set({ authUser: user }),

	login: async (data) => {
		// Login by token
		if (!data) {
			const user = await loginTokenApi();

			// Save user to store
			user.isOnline = true; // Set user online
			set({ authUser: user });
		}

		// Login by email and password
		else {
			const { user, accessToken, refreshToken } = await loginApi(data);

			// Save tokens to local storage
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);

			// Save user to store
			user.isOnline = true; // Set user online
			set({ authUser: user });
		}
	},

	logout: () => {
		// Remove tokens from local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		// Remove user from store
		set({ authUser: null });
	},

	updateAuthUser: async (data, optimisticData) => {
		// Save rollback data
		const prev = get().authUser;

		if (!prev) throw new Error('Chưa đăng nhập!');

		// Get optimistic data if not provided
		optimisticData ??= {
			...data,
			profilePicture: prev.profilePicture, // Keep old profile picture
			coverPicture: prev.coverPicture, // Keep old cover picture
		};

		// Optimistic update
		set({ authUser: { ...prev, ...optimisticData } });

		try {
			// Update to server
			const user = await updateProfileApi(data);
			set({ authUser: user });
		} catch (error) {
			// Rollback if error
			set({ authUser: prev });
			throw error;
		}
	},
}));
