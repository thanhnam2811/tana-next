import { UserFormType, UserType } from '@modules/user/types';
import { ILoginParams } from '@modules/auth/types';

export interface IUseAuth {
	authUser: UserType | null;
	setAuthUser: (data: UserType) => void;
	login: (data?: ILoginParams) => Promise<void>;
	logout: () => void;
	updateAuthUser: (data: UserFormType, optimisticData?: Partial<UserType>) => Promise<void>;
}
