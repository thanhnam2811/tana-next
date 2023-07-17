import { IFile } from '@common/types/IFile';

export type MediaType = Pick<IFile, '_id' | 'link' | 'description'> & { file?: File };

export type ReactionTypeValue = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface IPaginationResponse<T> {
	items: T[];
	totalItems: number;
	currentPage: number;
	totalPages: number;
	offset: number;
}

export interface IData {
	_id: string;

	createdAt: string;
	updatedAt: string;
	deleted?: boolean;
}

export interface IPaginationParams {
	page?: number;
	size?: number;
	offset?: number;

	[key: string]: any;
}
