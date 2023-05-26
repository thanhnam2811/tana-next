import { SERVER_URL } from '@utils/common';
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Check if error is unauthorized (status code 401)
const isUnauthorized = (error: any) => axios.isAxiosError(error) && error.response?.status === 401;

// Handle error
const handleError = (error: any) => {
	// eslint-disable-next-line no-console
	console.error('Call API error: ', error);

	let message = 'Lỗi kết nối đến máy chủ!';

	if (axios.isAxiosError(error)) {
		const { response } = error;
		if (response?.data?.message) message = response.data.message;
		else if (response?.data) message = response.data;
		else if (response?.statusText) message = response.statusText;
	} else if (error?.message) message = error.message;

	return Promise.reject(message);
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

export const apiCaller = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});

// Interceptors for request
apiClient.interceptors.request.use(
	(config) => {
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
	},
	(error) => handleError(error).catch(() => Promise.reject(error))
);

// Interceptors for response
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		// If unauthorized and not in excludeUrls, retry request
		if (isUnauthorized(error)) return retryRequest(error);

		return handleError(error);
	}
);

export default apiClient;
