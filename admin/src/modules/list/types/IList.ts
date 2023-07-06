import { IData } from '@common/types';

interface IList extends IData {
	key: string;
	name: string;
	items: string[];
	isPrivate: boolean;
}

export type ListType = IList;
export type ListFormType = IList;
