import { apiClient } from '@common/api';
import { PostFormType, PostType } from '../types';

export const updatePostApi = (id: string, data: PostFormType) =>
	apiClient.put<PostType>(`/posts/${id}`, data).then((res) => res.data);
