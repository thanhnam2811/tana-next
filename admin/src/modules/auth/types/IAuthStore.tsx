import { UserType } from '@/types/user.type';
import { ILoginParams } from '../api/login.api';

export default interface IAuthStore {
	isAuth: boolean;
	user: UserType | null;
	login: (params: ILoginParams) => Promise<void>;
	getProfile: () => Promise<void>;
	logout: () => void;
}
