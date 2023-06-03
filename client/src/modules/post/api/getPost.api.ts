import { apiClient, apiServer } from '@common/api';
import { CommentType } from '@interfaces';

export const getPostApi = (id: string, serverSide = false) => {
	if (serverSide) {
		return apiServer.get<CommentType>(`/posts/${id}`).then((res) => res.data);
	}

	return apiClient.get<CommentType>(`/posts/${id}`).then((res) => res.data);
};
