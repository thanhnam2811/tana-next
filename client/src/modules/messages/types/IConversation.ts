import { IData, MediaType } from '@common/types';
import { MessageType } from '@modules/messages/types';
import { UserType } from '@modules/user/types';

export interface IMember {
	user: UserType;
	role: 'admin' | 'member';
	nickname: string;
	addedAt: string;
	addedBy: UserType;
}

interface IConversation extends IData {
	members: IMember[] | string[];
	name: string;
	history: History[];
	lastest_message: MessageType;
	avatar: MediaType | string;
	type: 'direct' | 'group';
}

// For use
export type ConversationType = IConversation & { members: IMember[]; avatar: MediaType };

// For form
export type ConversationFormType = Partial<IConversation & { members: string[]; avatar: string }>;

// For create
export type ConversationCreateType = {
	members: { user: string; role?: string }[];
	name?: string;
};
