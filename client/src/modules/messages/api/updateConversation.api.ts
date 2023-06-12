import { apiClient } from '@common/api';
import { ConversationFormType, ConversationType } from '../types';

export const updateConversationApi = async (id: string, data: ConversationFormType) =>
	apiClient.put<ConversationType>(`conversations/${id}`, data).then((res) => res.data);
