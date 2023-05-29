import apiClient from './apiClient';

export interface IFileUploadResponse {
	message: string;
	files: IFile[];
}

export interface IFile {
	name: string;
	originalname: string;
	type: string;
	link: string;
	public_id: string;
	is_System: boolean;
	creator: string;
	_id: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

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

		return apiClient.post<IFileUploadResponse>('files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},
};
