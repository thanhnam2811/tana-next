import { ReactionType } from '@components/Popup';
import apiClient from './apiClient';

export const postApi = {
	reactToPost: (id: string, reaction: ReactionType) => apiClient.put(`/posts/${id}/react`, { type: reaction }),

	createPost: (data: { content: string }) => apiClient.post('/posts', data),
};
