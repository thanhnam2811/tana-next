import { UserType } from '@modules/user/types';
import { IData } from '@common/types';

export interface IActivity extends IData {
	user: UserType;
	type: string;
	content: string;
	link: string;
}
