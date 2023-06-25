import { UserType } from '@modules/user/types';

export interface IActivity {
	_id: string;
	user: UserType;
	type: string;
	content: string;
	link: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
