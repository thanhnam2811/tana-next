import axios from 'axios';

const handleApiError = (error: unknown) => {
	const message = 'Lỗi kết nối đến máy chủ!';

	if (axios.isAxiosError(error)) {
		const { response } = error;

		if (response?.data) {
			const { data } = response;

			if (data.message) return Promise.reject(data.message);

			if (data.error) {
				const { error } = data;

				if (error.message) return Promise.reject(error.message);

				return Promise.reject(error);
			}

			return Promise.reject(data);
		} else if (response?.statusText) return Promise.reject(response.statusText);
	}

	return Promise.reject(message);
};

export { handleApiError };
