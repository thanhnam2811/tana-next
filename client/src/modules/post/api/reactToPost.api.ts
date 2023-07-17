import { apiClient } from '@common/api';
import { ReactionTypeValue } from '@common/types';
import { PostType } from '../types';

export const reactToPostApi = (id: string, reaction: ReactionTypeValue) =>
	apiClient.put<PostType>(`/posts/${id}/react`, { type: reaction }).then((res) => res.data);
