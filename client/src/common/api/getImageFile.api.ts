import { IFile } from '@common/types';
import { apiClient } from '@common/api/apiClient';

interface ImageOptions {
	width?: number;
	height?: number;
}

export const getImageFileApi = (fileId: string, options: ImageOptions = {}) =>
	apiClient
		.get<IFile>(`files/${fileId}`, {
			params: options,
		})
		.then((res) => res.data);
