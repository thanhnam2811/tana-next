import { UserType } from '@common/types/user.type';
import { ILoginParams } from '../api/login.api';

export interface IAuthStore {
	user: UserType | null;
	login: (params: ILoginParams) => Promise<void>;
	getProfile: () => Promise<void>;
	logout: () => void;
}
