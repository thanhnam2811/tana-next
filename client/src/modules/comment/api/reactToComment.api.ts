import { apiClient } from '@common/api';
import { CommentType } from '../types';
import { ReactionTypeValue } from '@common/types';

export const reactToCommentApi = (postId: string, commentId: string, reaction: ReactionTypeValue) =>
	apiClient
		.put<CommentType>(`posts/${postId}/comments/${commentId}/react`, { type: reaction })
		.then((res) => res.data);
