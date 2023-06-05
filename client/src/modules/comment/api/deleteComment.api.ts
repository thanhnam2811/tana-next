import { apiClient } from '@common/api';
import { CommentType } from '../types';

export const deleteCommentApi = (postId: string, commentId: string) =>
	apiClient.delete<CommentType>(`posts/${postId}/comments/${commentId}`).then((res) => res.data);
