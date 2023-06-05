import { apiClient, apiServer } from '@common/api';
import { PostType } from '../types';

export const getPostApi = (id: string, serverSide = false) => {
	if (serverSide) {
		return apiServer.get<PostType>(`/posts/${id}`).then((res) => res.data);
	}

	return apiClient.get<PostType>(`/posts/${id}`).then((res) => res.data);
};
