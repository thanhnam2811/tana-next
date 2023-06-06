export type FriendSortType = 'desc' | 'asc';
export type GenderType = 'male' | 'female' | 'other';

export interface IFriendFilter {
	key?: string;
	sort?: FriendSortType;
	gender?: GenderType | '';
}
