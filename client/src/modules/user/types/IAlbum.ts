import { UserType } from '@modules/user/types';
import { IData, IPrivacy, MediaType } from '@common/types';

interface IAlbum extends IData {
	name: string;
	size: number;
	cover: MediaType;
	author: UserType | string;
	privacy: IPrivacy;
}

export type AlbumType = IAlbum;
export type AlbumFormType = IAlbum & { media: MediaType[] };
