import { ILoginParams } from '@utils/api';
import { UserFormType, UserType } from '@modules/user/types';

export interface IUseAuth {
	authUser: UserType | null;
	login: (data?: ILoginParams) => Promise<void>;
	logout: () => void;
	updateAuthUser: (data: UserFormType, optimisticData?: Partial<UserType>) => Promise<void>;
}
