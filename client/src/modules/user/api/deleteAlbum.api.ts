import { apiClient } from '@common/api';
import { AlbumType } from '@modules/user/types';

export const deleteAlbumApi = async (id: string) => apiClient.delete<AlbumType>(`/albums/${id}`);
