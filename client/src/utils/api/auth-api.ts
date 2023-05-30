import { UserType } from '@interfaces';
import apiClient from './apiClient';

export interface ILoginParams {
	email: string;
	password: string;
}

interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserType;
}

export interface IRegisterParams {
	fullname: string;
	phonenumber: string;
	email: string;
	password: string;
}

export interface IResetPasswordParams {
	id: string;
	token: string;
	password: string;
}

export const authApi = {
	login: async ({ email, password }: ILoginParams) => {
		// Call login API
		const res = await apiClient.post<ILoginResponse>('/auth/login', { email, password });
		const { accessToken, refreshToken } = res.data;

		// Save access token and refresh token to local storage
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		// Return user
		return res;
	},

	logout: () => {
		// Remove access token and refresh token from local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	},

	register: (data: IRegisterParams) => apiClient.post('/auth/register', data),

	getProfile: () => apiClient.get<UserType>('users/profile'),

	forgotPassword: (email: string) => apiClient.post('auth/password-reset', { email }),

	resetPassword: ({ id, token, password }: IResetPasswordParams) =>
		apiClient.post(`auth/password-reset/${id}/${token}`, { password }),
};
