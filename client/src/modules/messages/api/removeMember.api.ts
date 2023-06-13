import { apiClient } from '@common/api';
import { ConversationType } from '../types';

interface RemoveMemberData {
	conversationId: string;
	userID: string;
}
export const removeMemberApi = ({ conversationId, userID }: RemoveMemberData) =>
	apiClient
		.patch<ConversationType>(`/conversations/${conversationId}/members/remove`, {
			userID,
		})
		.then((res) => res.data);
