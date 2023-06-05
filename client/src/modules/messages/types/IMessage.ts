import { IData, IMedia } from '@common/types';
import { UserType } from '@modules/user/types';

interface IMessage extends IData {
	_id: string;
	text: string;
	media: IMedia[] | string[]; // string[] for create, update post

	deleted?: boolean;
	isSystem?: boolean;
	iv?: string;

	reader?: UserType[];
	sender: UserType;
	conversation: string;
}

// For use
export type MessageType = IMessage & { media: IMedia[] };

// For form
export type MessageFormType = Partial<IMessage & { media: string[] }>;
