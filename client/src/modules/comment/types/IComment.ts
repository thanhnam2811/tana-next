import { IData, MediaType, ReactionTypeValue } from '@common/types';
import { UserType } from '@modules/user/types';

interface IComment extends IData {
	_id: string;
	content: string;
	media: MediaType[];
	numberReact: number;
	numberReply: number;
	reactOfUser?: ReactionTypeValue;
	tags: any[];
	deleted: boolean;
	author: UserType;
	post: string;
}

// For use
export type CommentType = IComment;

// For form
export type CommentFormType = Partial<IComment>;
