import { apiClient } from '@common/api';
import { ILoginResponse, IRegisterData } from '../types';

export const registerApi = (data: IRegisterData) =>
	apiClient.post<ILoginResponse>('/auth/register', data).then((res) => res.data);
