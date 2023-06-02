import { UserFormType, UserType } from '@interfaces';
import { ILoginParams } from '@utils/api';

export interface IUseAuth {
	authUser: UserType | null;
	login: (data?: ILoginParams) => Promise<void>;
	logout: () => void;
	updateAuthUser: (data: UserFormType, optimisticData?: Partial<UserType>) => Promise<void>;
}
