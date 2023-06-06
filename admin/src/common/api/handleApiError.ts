import axios from 'axios';

const handleApiError = (error: unknown) => {
	let message = 'Lỗi kết nối đến máy chủ!';

	if (axios.isAxiosError(error)) {
		const { response } = error;
		if (response?.data?.message) message = response.data.message;
		else if (response?.data) message = response.data;
		else if (response?.statusText) message = response.statusText;
	}

	return Promise.reject(message);
};

export { handleApiError };
