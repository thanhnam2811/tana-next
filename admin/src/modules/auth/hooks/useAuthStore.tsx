import { create } from 'zustand';
import loginApi, { ILoginParams } from '../api/login.api';
import IAuthStore from '../types/IAuthStore';
import getProfileApi from '../api/getProfile.api';

const useAuthStore = create<IAuthStore>()((set) => ({
	isAuth: false,
	user: null,

	login: async (params: ILoginParams) => {
		// Call login api
		const { user, accessToken, refreshToken } = await loginApi(params);

		// Save access token and refresh token to local storage
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		// Set user and isAuth to true
		set({ isAuth: true, user });
	},

	getProfile: async () => {
		// Call get profile api
		const user = await getProfileApi();

		// Set user and isAuth to true
		set({ isAuth: true, user });
	},

	logout: () => {
		// Remove access token and refresh token from local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');

		// Set user and isAuth to false
		set({ isAuth: false, user: null });
	},
}));

export default useAuthStore;
