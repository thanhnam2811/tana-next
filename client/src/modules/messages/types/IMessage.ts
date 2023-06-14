import { IData, IFile, IMedia } from '@common/types';
import { UserType } from '@modules/user/types';

interface IMessage extends IData {
	_id: string;
	text: string;
	media: IFile[] | string[]; // string[] for create, update post

	deleted?: boolean;
	isSystem?: boolean;
	iv?: string;

	reader?: UserType[];
	sender: UserType;
	conversation: string;

	sending?: boolean; // for UI
}

// For use
export type MessageType = IMessage & { media: IFile[] };

// For form
export type MessageFormType = IMessage & { media: string[]; files?: File[] };
