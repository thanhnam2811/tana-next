import apiClient from './apiClient';
import { UserFormType, UserType } from '@modules/user/types';

export const userApi = {
	endpoint: {
		searchUser: 'users/searchUser',
	},

	searchUser: (type: string, params: any) =>
		apiClient.get(`users/searchUser/${type}`, {
			params,
		}),

	get: (id: string) => apiClient.get<UserType>(`users/${id}`),

	update: (data: UserFormType) => apiClient.put<UserType>(`users/update-profile`, data),

	requestFriend: (userId: string) => apiClient.put(`users/${userId}/friend-request`),

	acceptFriend: (userId: string) => apiClient.put(`users/${userId}/accept-friend`),

	rejectFriend: (userId: string) => apiClient.put(`users/${userId}/reject-friend`),

	unFriend: (userId: string) => apiClient.put(`users/${userId}/unfriend`),
};
