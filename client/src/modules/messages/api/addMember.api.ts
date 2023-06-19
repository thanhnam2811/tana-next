import { apiClient } from '@common/api';
import { ConversationType } from '../types';

interface AddMemberData {
	conversationId: string;
	members: string[];
}
export const addMemberApi = ({ conversationId, members }: AddMemberData) =>
	apiClient
		.patch<ConversationType>(`/conversations/${conversationId}/members/add`, {
			newMembers: members.map((id) => ({ user: id })),
		})
		.then((res) => res.data);
