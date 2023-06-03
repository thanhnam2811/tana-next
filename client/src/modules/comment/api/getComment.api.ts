import { apiClient } from '@common/api';
import { IPaginationResponse } from '@interfaces';
import { CommentType } from '../types';

export const getCommentApi = (postId: string) =>
	apiClient.get<IPaginationResponse<CommentType>>(`posts/${postId}/comments`).then((res) => res.data);
