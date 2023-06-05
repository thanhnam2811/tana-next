import { apiClient } from '@common/api';
import { IResetPasswordParams } from '../types';

export const resetPasswordApi = ({ id, password, token }: IResetPasswordParams) =>
	apiClient.post(`/auth/password-reset/${id}/${token}`, { password }).then((res) => res.data);
