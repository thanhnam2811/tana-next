import { UserType } from './IUser';
import { IMedia } from './common';

export interface IComment {
	_id: string;
	content: string;
	media: IMedia[];
	numberReact: number;
	numberReply: number;
	reactOfUser?: string;
	tags: any[];
	deleted: boolean;
	author: UserType;
	post: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
