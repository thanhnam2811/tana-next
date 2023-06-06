import { apiClient } from '@common/api';
import { CommentFormType, CommentType } from '../types';

export const createCommentApi = (postId: string, data: CommentFormType) =>
	apiClient.post<CommentType>(`posts/${postId}/comments`, data).then((res) => res.data);
