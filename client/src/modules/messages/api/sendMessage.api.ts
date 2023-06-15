import { apiClient } from '@common/api';
import { MessageFormType, MessageType } from '../types';

export const sendMessageApi = (convId: string, data: MessageFormType) =>
	apiClient.post<MessageType>(`conversations/${convId}/messages`, data).then((res) => res.data);
