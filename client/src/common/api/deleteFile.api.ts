import { apiClient } from '@common/api/apiClient';
import { IFile } from '@common/types';

export const deleteFileApi = (id: string) => apiClient.delete<IFile>(`files/${id}`).then((res) => res.data);
