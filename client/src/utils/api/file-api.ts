import apiClient from './apiClient';

export const fileApi = {
	upload: (files: FileList | File[], data: any = {}) => {
		const formData = new FormData();

		// append files
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		// append data
		for (const key in data) {
			if (data[key] !== undefined) {
				formData.append(key, data[key]);
			}
		}

		return apiClient.post('files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},
};
