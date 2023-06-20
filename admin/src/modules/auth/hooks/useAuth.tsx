import { create } from 'zustand';
import { getProfileApi, ILoginParams, loginApi } from '../api';
import { IAuthStore } from '../types/IAuthStore';

export const useAuth = create<IAuthStore>()((set) => ({
	user: null,

	login: async (params: ILoginParams) => {
		// Call login api
		const { user, accessToken, refreshToken } = await loginApi(params);

		// Save access token and refresh token to local storage
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		// Set user and isAuth to true
		set({ user });
	},

	getProfile: async () => {
		// Call get profile api
		const user = await getProfileApi();

		// Set user and isAuth to true
		set({ user });
	},

	logout: () => {
		// Remove access token and refresh token from local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		// Set user and isAuth to false
		set({ user: null });
	},
}));
