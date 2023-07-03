import { apiClient } from '@common/api';
import { AlbumFormType, AlbumType } from '@modules/user/types';

export const updateAlbumApi = (id: string, data: Partial<AlbumFormType>) =>
	apiClient.put<AlbumType>(`/albums/${id}`, data).then((res) => res.data);
