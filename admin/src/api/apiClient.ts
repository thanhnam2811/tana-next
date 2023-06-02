import { API_URL, MAX_RETRY } from '@/config';
import axios from 'axios';
import handleApiError from './handleApiError';
import retryRequest from './retryRequest';

// Check if error is unauthorized (status code 401)
const isUnauthorized = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 401;

// Create an axios instance
const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Max-Retry': MAX_RETRY,
		'Retry-Count': 0,
	},
	timeout: 10000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ! (Có thể do máy chủ chưa khởi động, vui lòng thử lại sau)',
});

// Interceptors for request
apiClient.interceptors.request.use(
	(config) => {
		// Get access token from local storage
		const accessToken = localStorage.getItem('accessToken');

		// If access token exists, add it to request header
		if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

		return config;
	},
	(error) => handleApiError(error)
);

// Interceptors for response
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		// If unauthorized and not in excludeUrls, retry request
		if (isUnauthorized(error)) return retryRequest(error);

		return handleApiError(error);
	}
);

export default apiClient;
