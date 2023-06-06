import { apiClient } from '@common/api';
import { PostType } from '../types';

export const deletePostApi = (id: string) => apiClient.delete<PostType>(`/posts/${id}`).then((res) => res.data);
