import { apiClient } from '@common/api';
import { ConversationCreateType, ConversationType } from '../types';

export const updateConversationApi = async (id: string, data: ConversationCreateType) =>
	apiClient.put<ConversationType>(`conversations/${id}`, data).then((res) => res.data);
