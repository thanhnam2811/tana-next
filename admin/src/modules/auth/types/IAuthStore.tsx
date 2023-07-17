import { UserType } from '@modules/user/types';
import { ILoginParams } from '@modules/auth/api';

export interface IAuthStore {
	user: UserType | null;
	login: (params: ILoginParams) => Promise<void>;
	getProfile: () => Promise<void>;
	logout: () => void;
}
