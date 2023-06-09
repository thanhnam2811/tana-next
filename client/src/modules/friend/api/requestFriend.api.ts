import { apiClient } from '@common/api';

export const requestFriendApi = (userId: string) => apiClient.put(`users/${userId}/friend-request`);
