import { IPrivacy } from './IPrivacy';
import { IUser } from './IUser';
import { IMedia } from './common';

export interface IPost {
	_id: string;
	content: string;
	media: IMedia[] | string[]; // string[] for create, update post
	numberReact: number;
	numberShare: number;
	numberComment: number;
	tags: any[];
	privacy: IPrivacy;
	deleted: boolean;
	author: IUser;
	createdAt: string;
	updatedAt: string;
	reactOfUser: string;
}
