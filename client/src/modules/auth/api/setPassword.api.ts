import { apiClient } from '@common/api';
import { ISetPasswordParams } from '@modules/auth/types';

export const setPasswordApi = (data: ISetPasswordParams) =>
	apiClient.put('/auth/set-password', data).then((res) => res.data);
