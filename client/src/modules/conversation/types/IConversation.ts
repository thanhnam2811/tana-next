import { IData, IMedia } from '@common/types';
import { MessageType } from '@modules/messages/types';
import { UserType } from '@modules/user/types';

export interface IMember {
	user: UserType;
	role: string;
	nickname: string;
	addedAt: string;
	addedBy: UserType;
}

interface IConversation extends IData {
	members: IMember[] | string[];
	name: string;
	history: History[];
	lastest_message: MessageType;
	avatar: IMedia;
}

// For use
export type ConversationType = IConversation & { members: IMember[] };

// For form
export type ConversationFormType = Partial<IConversation & { members: string[] }>;
