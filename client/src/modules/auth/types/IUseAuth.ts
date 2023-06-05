import { UserFormType, UserType } from '@common/types';
import { ILoginParams } from '@utils/api';

export interface IUseAuth {
	authUser: UserType | null;
	login: (data?: ILoginParams) => Promise<void>;
	logout: () => void;
	updateAuthUser: (data: UserFormType, optimisticData?: Partial<UserType>) => Promise<void>;
}
