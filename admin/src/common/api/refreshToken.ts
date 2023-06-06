import { apiClient } from '.';

const refreshAccessToken = async () => {
	// Get refresh token from local storage
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) throw new Error('Không tìm thấy refresh token!');

	// Call refresh token API
	const {
		data: { accessToken },
	} = await apiClient.post<{ accessToken: string }>('/admin/refresh', { refreshToken });

	// Save new access token to local storage
	localStorage.setItem('accessToken', accessToken);

	return accessToken;
};

export { refreshAccessToken };
