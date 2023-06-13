import { apiClient } from '@common/api';
import { ConversationType } from '../types';

interface ChangeNicknameData {
	conversationId: string;
	userID: string;
	nickname: string;
}

export const changeNicknameApi = ({ conversationId, userID, nickname }: ChangeNicknameData) =>
	apiClient
		.patch<ConversationType>(`/conversations/${conversationId}/members/changeNickname`, {
			userID,
			nickname,
		})
		.then((res) => res.data);
