import apiClient from './apiClient';

interface LoginParams {
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
		const res = await apiClient.post('/auth/login', { email, password });
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

	register: (data: RegisterParams) => apiClient.post('/auth/register', data),

	getProfile: () => apiClient.get('users/profile'),

	forgotPassword: (email: string) => apiClient.post('auth/password-reset', { email }),

	resetPassword: ({ id, token, password }: ResetPasswordParams) =>
		apiClient.post(`auth/password-reset/${id}/${token}`, { password }),
};
