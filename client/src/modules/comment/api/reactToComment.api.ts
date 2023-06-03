import { apiClient } from '@common/api';
import { CommentType } from '../types';
import { ReactionType } from '@interfaces';

export const reactToCommentApi = (postId: string, commentId: string, reaction: ReactionType) =>
	apiClient
		.put<CommentType>(`posts/${postId}/comments/${commentId}/react`, { type: reaction })
		.then((res) => res.data);
