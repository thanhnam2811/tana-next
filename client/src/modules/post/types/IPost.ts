import { IData, IPrivacy, MediaType, ReactionTypeValue } from '@common/types';
import { UserType } from '@modules/user/types';

interface IPost extends IData {
	author: UserType;
	privacy: IPrivacy;

	content: string;
	media: MediaType[] | Omit<MediaType, 'link'>[];
	tags: any[];

	numberReact: number;
	numberShare: number;
	numberComment: number;

	reactOfUser: ReactionTypeValue;
	deleted: boolean;
}

// For use
export type PostType = IPost & { media: MediaType[] };

// For form
export type PostFormType = Partial<IPost & { media: Omit<MediaType, 'link'>[] }>;
