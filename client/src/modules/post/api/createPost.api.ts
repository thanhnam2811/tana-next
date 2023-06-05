import { apiClient } from '@common/api';
import { PostFormType, PostType } from '../types';

export const createPostApi = (data: PostFormType) => apiClient.post<PostType>('/posts', data).then((res) => res.data);
