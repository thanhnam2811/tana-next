import { IFile, IFileUploadResponse } from '@common/types';
import { apiClient } from './apiClient';

interface DataType {
	[key: string]: any;
}

export const uploadMultiFileApi = (files: FileList | File[], data: DataType = {}) => {
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

export const uploadFileApi = (file: File, data: DataType = {}) => {
	const formData = new FormData();

	// append files
	formData.append('file', file);

	// append data
	for (const key in data) {
		if (data[key] != null) formData.append(key, data[key]);
	}

	return apiClient
		.post<IFile>('files', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => res.data);
};
