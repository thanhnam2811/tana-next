import { apiClient } from '@common/api';

interface ChangeRoleData {
	conversationId: string;
	userId: string;
	role: 'admin' | 'member';
}

export const changeRoleApi = ({ conversationId, userId, role }: ChangeRoleData) =>
	apiClient
		.patch(`/conversations/${conversationId}/members/changeRole`, {
			userId,
			role,
		})
		.then((res) => res.data);
