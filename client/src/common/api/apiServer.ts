import axios from 'axios';
import { SERVER_URL } from '@common/config';

export const apiServer = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});
