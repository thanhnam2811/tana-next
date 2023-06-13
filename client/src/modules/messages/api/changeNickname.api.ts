import { apiClient } from '@common/api';

interface ChangeNicknameData {
	conversationId: string;
	userId: string;
	nickname: string;
}

export const changeNicknameApi = ({ conversationId, userId, nickname }: ChangeNicknameData) =>
	apiClient
		.patch(`/conversations/${conversationId}/members/changeNickname`, {
			userId,
			nickname,
		})
		.then((res) => res.data);
