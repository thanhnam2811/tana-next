import { apiClient } from '@common/api';
import { ConversationType } from '../types';

interface ChangeRoleData {
	conversationId: string;
	userID: string;
	role: 'admin' | 'member';
}

export const changeRoleApi = ({ conversationId, userID, role }: ChangeRoleData) =>
	apiClient
		.patch<ConversationType>(`/conversations/${conversationId}/members/changeRole`, {
			userID,
			role,
		})
		.then((res) => res.data);
