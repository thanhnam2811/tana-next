import { UserType } from '@common/types';
import { ILoginParams } from '../api/login.api';

export interface IAuthStore {
	user: UserType | null;
	login: (params: ILoginParams) => Promise<void>;
	getProfile: () => Promise<void>;
	logout: () => void;
}
