import axios from 'axios';
import { SERVER_URL } from '@common/config';
import { handleError } from '@common/api/apiClient';

export const apiServer = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 5000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});

apiServer.interceptors.response.use((response) => response, handleError);
