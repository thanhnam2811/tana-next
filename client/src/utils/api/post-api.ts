import { ReactionType } from '@components/Popup';
import apiClient, { apiCaller } from './apiClient';
import { IPost } from '@interfaces';

export const postApi = {
	react: (id: string, reaction: ReactionType) => apiClient.put(`/posts/${id}/react`, { type: reaction }),

	create: (data: { content: string }) => apiClient.post('/posts', data),

	get: (id: string) => apiClient.get<IPost>(`/posts/${id}`),

	serverGet: (id: string) => apiCaller.get<IPost>(`/posts/${id}`),
};
