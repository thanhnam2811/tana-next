import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient, handleApiError, refreshAccessToken } from '.';

const excludeUrls = ['/admin/login', '/admin/refresh'];

const retryRequest = async (error: AxiosError) => {
	// Get retry config, retry count and max retry
	const retryConfig = error.config as InternalAxiosRequestConfig;

	// Check if request is excluded
	if (excludeUrls.includes(retryConfig.url as string)) return handleApiError(error);

	// Check if retry count is greater than max retry
	const retryCount = Number(retryConfig.headers['Retry-Count']);
	const maxRetry = Number(retryConfig.headers['Max-Retry']);
	if (retryCount >= maxRetry) return handleApiError(error);

	// Increase retry count
	retryConfig.headers['Retry-Count'] = retryCount + 1;

	// Refresh token
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) return handleApiError(error);

	// Call refresh token API
	try {
		const accessToken = await refreshAccessToken();

		// Update access token
		retryConfig.headers.Authorization = `Bearer ${accessToken}`;

		// Retry request
		return apiClient.request(retryConfig);
	} catch (error) {
		return handleApiError(error);
	}
};

export { retryRequest };
