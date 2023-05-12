import apiClient from './apiClient';

export interface LoginParams {
	email: string;
	password: string;
}

interface RegisterParams {
	fullname: string;
	phonenumber: string;
	email: string;
	password: string;
}

interface ResetPasswordParams {
	id: string;
	token: string;
	password: string;
}

export const authApi = {
	login: async ({ email, password }: LoginParams) => {
		// Call login API
		const res = await apiClient.post('/admin/login', { email, password });
		const { accessToken, refreshToken } = res.data;

		// Save access token and refresh token to local storage
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		// Return user
		return res;
	},

	refreshToken: () => {
		// Get refresh token from local storage
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) throw new Error('Không tìm thấy refresh token!');

		// Call refresh token API
		return apiClient.post('/admin/refresh', { refreshToken });
	},

	logout: () => {
		// Remove access token and refresh token from local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	},

	getProfile: () => apiClient.get('users/profile'),

	forgotPassword: (email: string) => apiClient.post('auth/password-reset', { email }),

	resetPassword: ({ id, token, password }: ResetPasswordParams) =>
		apiClient.post(`auth/password-reset/${id}/${token}`, { password }),
};
