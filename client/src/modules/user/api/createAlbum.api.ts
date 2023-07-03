import { apiClient } from '@common/api';
import { AlbumFormType, AlbumType } from '@modules/user/types';

export const createAlbumApi = (data: AlbumFormType) =>
	apiClient.post<AlbumType>('/albums', data).then((res) => res.data);
