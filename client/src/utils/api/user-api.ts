import apiClient from './apiClient';

export const userApi = {
	searchUser: (type: string, params: any) =>
		apiClient.get(`users/searchUser/${type}`, {
			params,
		}),

	get: (id: string) => apiClient.get(`users/${id}`),

	update: (data: any) => apiClient.put(`users/update-profile`, data),

	requestFriend: (userId: string) => apiClient.post(`users/${userId}/friend-request`),

	acceptFriend: (userId: string) => apiClient.post(`users/${userId}/accept-friend`),

	rejectFriend: (userId: string) => apiClient.post(`users/${userId}/reject-friend`),

	unFriend: (userId: string) => apiClient.post(`users/${userId}/unfriend`),
};
