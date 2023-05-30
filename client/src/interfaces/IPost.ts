import { IPrivacy } from './IPrivacy';
import { UserType } from './IUser';
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
	author: UserType;
	createdAt: string;
	updatedAt: string;
	reactOfUser: string;
}

export type PostType = IPost & { media: IMedia[] }; // for use in component
