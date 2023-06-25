import { IFileUploadResponse } from '@common/types';
import { apiClient } from './apiClient';

export const uploadFileApi = (files: FileList | File[], data: any = {}) => {
	console.log('uploadFileApi', files, files.length);
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

	return apiClient
		.post<IFileUploadResponse>('files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};
