import { apiClient } from '@common/api';

export const readNotificationApi = (id: string) => apiClient.put(`notifications/read/${id}`).then((res) => res.data);
