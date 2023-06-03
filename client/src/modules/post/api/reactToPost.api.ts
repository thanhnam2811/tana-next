import { apiClient } from '@common/api';
import { ReactionType } from '@interfaces';
import { PostType } from '../types';

export const reactToPostApi = (id: string, reaction: ReactionType) =>
	apiClient.put<PostType>(`/posts/${id}/react`, { type: reaction }).then((res) => res.data);
