import { apiClient } from '@common/api';
import { CommentFormType, CommentType } from '../types';

export const updateCommentApi = (postId: string, commentId: string, data: CommentFormType) =>
	apiClient.put<CommentType>(`posts/${postId}/comments/${commentId}`, data).then((res) => res.data);
