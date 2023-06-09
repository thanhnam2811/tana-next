import { apiClient } from '@common/api';

export const acceptFriendApi = (userId: string) => apiClient.put(`users/${userId}/accept-friend`);
