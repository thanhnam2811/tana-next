import { UserFormType, UserType } from '@modules/user/types';
import { apiClient } from '@common/api';

export const updateProfileApi = (data: UserFormType) =>
	apiClient.put<UserType>(`users/update-profile`, data).then((res) => res.data);
