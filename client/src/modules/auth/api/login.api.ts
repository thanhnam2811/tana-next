import { apiClient } from '@common/api';
import { ILoginParams, ILoginResponse } from '../types';

export const loginApi = ({ email, password }: ILoginParams) =>
	apiClient.post<ILoginResponse>('/auth/login', { email, password }).then((res) => res.data);
