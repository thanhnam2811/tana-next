import { ReactionType } from '@components/Popup';
import apiClient, { apiCaller } from './apiClient';
import { PostFormType, PostType } from '@common/types';

export const postApi = {
	react: (id: string, reaction: ReactionType) => apiClient.put(`/posts/${id}/react`, { type: reaction }),

	create: (data: PostFormType) => apiClient.post('/posts', data),

	update: (id: string, data: PostFormType) => apiClient.put(`/posts/${id}`, data),

	get: (id: string) => apiClient.get<PostType>(`/posts/${id}`),

	serverGet: (id: string) => apiCaller.get<PostType>(`/posts/${id}`),

	delete: (id: string) => apiClient.delete<PostType>(`/posts/${id}`),
};
