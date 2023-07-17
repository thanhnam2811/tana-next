import { apiClient } from '@common/api';
import { UserType } from '@modules/user/types';

export interface ILoginParams {
	email: string;
	password: string;
}

interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserType;
}

export const loginApi = ({ email, password }: ILoginParams) =>
	apiClient.post<ILoginResponse>('/admin/login', { email, password }).then((res) => res.data);
