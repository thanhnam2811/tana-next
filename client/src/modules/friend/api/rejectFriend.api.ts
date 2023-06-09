import { apiClient } from '@common/api';

export const rejectFriendApi = (userId: string) => apiClient.put(`users/${userId}/reject-request`);
