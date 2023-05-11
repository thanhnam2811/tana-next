import { ReactionType } from '@components/Popup';
import apiClient from './apiClient';

export type GetCommentsParams = any; // TODO: Define params type
export type CreateCommentData = any; // TODO: Define data type
export type UpdateCommentData = any; // TODO: Define data type

export const commentApi = {
	getComments: (postId: string, params: GetCommentsParams) => apiClient.get(`posts/${postId}/comments`, { params }),

	createComment: (postId: string, data: CreateCommentData) => apiClient.post(`posts/${postId}/comments`, data),

	replyComment: (postId: string, commentId: string, data: CreateCommentData) =>
		apiClient.post(`posts/${postId}/comments/${commentId}/reply`, data),

	updateComment: (postId: string, commentId: string, data: UpdateCommentData) =>
		apiClient.put(`posts/${postId}/comments/${commentId}`, data),

	deleteComment: (postId: string, commentId: string) => apiClient.delete(`posts/${postId}/comments/${commentId}`),

	reactToComment: (postId: string, commentId: string, reaction: ReactionType) =>
		apiClient.put(`posts/${postId}/comments/${commentId}/react`, { type: reaction }),
};
