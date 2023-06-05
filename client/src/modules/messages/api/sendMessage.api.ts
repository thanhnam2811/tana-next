import { apiClient } from '@common/api';
import { MessageFormType } from '../types';

export const sendMessageApi = (convId: string, data: MessageFormType) =>
	apiClient.post(`conversations/${convId}/messages`, data).then((res) => res.data);
