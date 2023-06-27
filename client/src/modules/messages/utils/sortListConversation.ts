import { ConversationType } from '@modules/messages/types';

export const sortListConversation = (listConversation: ConversationType[]) =>
	listConversation.sort((a, b) => {
		const aTime = a.lastest_message ? a.lastest_message.createdAt : a.updatedAt;
		const bTime = b.lastest_message ? b.lastest_message.createdAt : b.updatedAt;

		return new Date(bTime).getTime() - new Date(aTime).getTime();
	});
