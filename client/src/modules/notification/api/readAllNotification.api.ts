import { apiClient } from '@common/api';

export const readAllNotificationApi = () => apiClient.put(`notifications/read`).then((res) => res.data);
