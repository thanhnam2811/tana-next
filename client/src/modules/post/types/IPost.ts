import { IData, IMedia, IPrivacy, ReactionTypeValue } from '@common/types';
import { UserType } from '@modules/user/types';

interface IPost extends IData {
	author: UserType;
	privacy: IPrivacy;

	content: string;
	media: IMedia[] | Omit<IMedia, 'link'>[];
	tags: any[];

	numberReact: number;
	numberShare: number;
	numberComment: number;

	reactOfUser: ReactionTypeValue;
	deleted: boolean;
}

// For use
export type PostType = IPost & { media: IMedia[] };

// For form
export type PostFormType = Partial<IPost & { media: Omit<IMedia, 'link'>[] }>;
