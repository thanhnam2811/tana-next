import { IData, IMedia, IPrivacy, UserType } from '@interfaces';

interface IPost extends IData {
	author: UserType;
	privacy: IPrivacy;

	content: string;
	media: IMedia[] | string[]; // string[] for create, update post
	tags: any[];

	numberReact: number;
	numberShare: number;
	numberComment: number;

	reactOfUser: string;
	deleted: boolean;
}

// For use
export type PostType = IPost & { media: IMedia[] };

// For form
export type PostFormType = Partial<IPost & { media: string[] }>;