import axios from 'axios';

export const apiServer = axios.create({
	baseURL: process.env.SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
	timeoutErrorMessage: 'Lỗi kết nối đến máy chủ!',
});
