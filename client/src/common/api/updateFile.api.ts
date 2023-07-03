import { apiClient } from '@common/api/apiClient';
import { IFile } from '@common/types';

export const updateFileApi = (id: string, data: Record<string, string>) =>
	apiClient.put<IFile>(`files/${id}`, data).then((res) => res.data);
