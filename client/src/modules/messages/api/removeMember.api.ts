import { apiClient } from '@common/api';

interface RemoveMemberData {
	conversationId: string;
	userId: string;
}
export const removeMemberApi = ({ conversationId, userId }: RemoveMemberData) =>
	apiClient.delete(`/conversations/${conversationId}/members/${userId}`).then((res) => res.data);
