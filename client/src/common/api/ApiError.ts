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

			if (response?.data?.error?.message) message = response.data.error.message;
			else if (response?.data?.message) message = response.data.message;
			else if (response?.data) message = response.data;
			else if (response?.statusText) message = response.statusText;

			return new ApiError(code, message);
		}

		return new ApiError(500);
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
