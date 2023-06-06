import { apiClient } from '@common/api';
import { CommentFormType, CommentType } from '../types';

export const replyToCommentApi = (postId: string, commentId: string, data: CommentFormType) =>
	apiClient.post<CommentType>(`posts/${postId}/comments/${commentId}/reply`, data).then((res) => res.data);
