import { apiClient } from '@common/api';

export const leaveConversationApi = (id: string) => apiClient.put(`conversations/${id}/leave`).then((res) => res.data);
