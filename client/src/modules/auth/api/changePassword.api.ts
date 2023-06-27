import { apiClient } from '@common/api';
import { IChangePasswordParams } from '@modules/auth/types';

export const changePasswordApi = (data: IChangePasswordParams) =>
	apiClient.put('/auth/change-password', data).then((res) => res.data);
