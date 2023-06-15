import { apiClient } from '@common/api';
import { ConversationCreateType, ConversationType } from '../types';

export const createConversationApi = async (data: ConversationCreateType) =>
	apiClient.post<ConversationType>('/conversations', data).then((res) => res.data);
