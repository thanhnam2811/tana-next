import { ReactionType } from '@components/Popup';
import apiClient, { apiCaller } from './apiClient';
import { IPost } from '@interfaces';

export const postApi = {
	react: (id: string, reaction: ReactionType) => apiClient.put(`/posts/${id}/react`, { type: reaction }),

	create: (data: Partial<IPost>) => apiClient.post('/posts', data),

	update: (id: string, data: Partial<IPost>) => apiClient.put(`/posts/${id}`, data),

	get: (id: string) => apiClient.get<IPost>(`/posts/${id}`),

	serverGet: (id: string) => apiCaller.get<IPost>(`/posts/${id}`),

	delete: (id: string) => apiClient.delete<IPost>(`/posts/${id}`),
};
