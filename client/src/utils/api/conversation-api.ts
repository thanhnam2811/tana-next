import apiClient from './apiClient';

export type UpdateMembersType = 'add' | 'remove' | 'changeNickname' | 'changeRole';

export const conversationApi = {
	create: (data: any) => apiClient.post(`conversations`, data),

	get: (id: string) => apiClient.get(`conversations/${id}`),

	update: (id: string, data: any) => apiClient.put(`conversations/${id}`, data),

	delete: (id: string) => apiClient.delete(`conversations/${id}`),

	addMembers: (id: string, newMembers: { user: string }[]) =>
		apiClient.patch(`conversations/${id}/members/add`, { newMembers }),

	updateMember: (id: string, type: UpdateMembersType, data: any) =>
		apiClient.patch(`conversations/${id}/members/${type}`, data),
};
