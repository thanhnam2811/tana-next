import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SERVER_URL } from '@common/config';
import { ApiError } from '@common/api/ApiError';

// Check if error is unauthorized (status code 401)
const isUnauthorized = (error: any) => axios.isAxiosError(error) && error.response?.status === 401;

// Handle error
export const handleError = (error: any) => {
	// Remove access token, refresh token from local storage
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');

	if (ApiError.isApiError(error)) return Promise.reject(error);

	if (axios.isAxiosError(error)) return Promise.reject(ApiError.fromAxiosError(error));

	return Promise.reject(ApiError.fromError(error));
};

const MAX_RETRY = 3;
const excludeUrls = ['/auth/login', '/auth/register', '/auth/refresh'];

const retryRequest = async (error: AxiosError) => {
	// Get retry config, retry count and max retry
	const retryConfig = error.config as InternalAxiosRequestConfig;

	// Check if request is excluded
	if (excludeUrls.includes(retryConfig.url as string)) return handleError(error);

	// Check if retry count is greater than max retry
	const retryCount = Number(retryConfig.headers['Retry-Count']);
	const maxRetry = Number(retryConfig.headers['Max-Retry']);
	if (retryCount >= maxRetry) return handleError(error);

	// Increase retry count
	retryConfig.headers['Retry-Count'] = retryCount + 1;

	// Refresh token
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) return handleError(error);

	// Call refresh token API
	const { data } = await apiClient.post('/auth/refresh', { refreshToken });

	// Save new access token to local storage
	localStorage.setItem('accessToken', data.accessToken);

	// Update access token
	retryConfig.headers.Authorization = `Bearer ${data.accessToken}`;

	// Retry request
	return apiClient.request(retryConfig);
};

// Create an axios instance
const apiClient = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
		'Max-Retry': MAX_RETRY,
		'Retry-Count': 0,
	},
	timeout: 10000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});

// Interceptors for request
apiClient.interceptors.request.use((config) => {
	try {
		// Get access token from local storage
		const accessToken = localStorage.getItem('accessToken');

		// If access token exists, add it to request header
		if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Get access token error: ', error);
	}

	return config;
}, handleError);

// Interceptors for response
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		// If unauthorized and not in excludeUrls, retry request
		if (isUnauthorized(error)) return retryRequest(error);

		return handleError(error);
	}
);

export function swrFetcher<T>(url: string) {
	return apiClient
		.get<T>(url)
		.then((res) => res.data)
		.catch(handleError);
}

export { apiClient };
