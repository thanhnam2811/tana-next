import { MessageType } from './IMessage';
import { UserType } from './IUser';
import { IData, IMedia } from './common';

export interface Member {
	user: UserType;
	role: string;
	nickname: string;
	addedAt: string;
	addedBy: UserType;
}

interface IConversation extends IData {
	_id: string;
	members: Member[];
	name: string;
	deleted: boolean;
	history: History[];
	user_deleted: any[];
	creator: string;
	lastest_message: MessageType;
	avatar: IMedia;
}

// For use
export type ConversationType = IConversation;

// For form
export type ConversationFormType = Partial<IConversation>;
