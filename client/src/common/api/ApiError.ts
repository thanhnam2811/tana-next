import { AxiosError } from 'axios';

export class ApiError {
	code: number;
	message: string;

	constructor(code: number, message = 'Lỗi kết nối đến máy chủ!') {
		this.code = code;
		this.message = message;

		console.error(`[ApiError]: ${this.toString()}`);
	}

	static fromAxiosError(error: AxiosError<any>) {
		const { response } = error;
		if (response?.status) {
			const code = response.status;
			let message = 'Lỗi kết nối đến máy chủ!';

			const { data, statusText } = response;

			if (data) {
				const { error, message: dataMsg } = data;

				if (error) {
					const { message: errorMsg } = error;

					message = errorMsg || error;
				} else message = dataMsg || data;
			} else if (statusText) message = statusText;

			return new ApiError(code, message);
		}

		return new ApiError(500, error.message);
	}

	static fromError(error: Error) {
		return new ApiError(500, error.message);
	}

	static isApiError(error: any): error is ApiError {
		return !!Number(error?.code) && !!error?.message;
	}

	toString() {
		return `[${this.code}]: ${this.message}`;
	}
}
