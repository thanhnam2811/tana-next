import { IPrivacy } from './IPrivacy';
import { IUser } from './IUser';

export interface IPost {
	_id: string;
	content: string;
	media: any[];
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
