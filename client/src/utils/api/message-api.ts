import apiClient from './apiClient';

export const messageApi = {
	create: (convId: string, data: any) => apiClient.post(`conversations/${convId}/messages`, data),
};
