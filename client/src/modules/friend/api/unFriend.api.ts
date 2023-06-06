import { apiClient } from '@common/api';

export const unFriendApi = (userId: string) => apiClient.put(`users/${userId}/unfriend`);
