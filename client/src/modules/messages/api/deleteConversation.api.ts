import { apiClient } from '@common/api';
import { ConversationType } from '../types';

export const deleteConversationApi = async (id: string) =>
	apiClient.delete<ConversationType>(`conversations/user-deleted/${id}`).then((res) => res.data);
