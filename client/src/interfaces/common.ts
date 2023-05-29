export interface IMedia {
	_id: string;
	link: string;
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface IPaginationResponse<T> {
	items: T[];
	totalItems: number;
	currentPage: number;
	totalPages: number;
	offset: number;
}
