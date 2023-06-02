import apiClient from '@/api/apiClient';
import { UserType } from '@/types/user.type';

export interface ILoginParams {
	email: string;
	password: string;
}

interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserType;
}

const loginApi = ({ email, password }: ILoginParams) =>
	apiClient.post<ILoginResponse>('/admin/login', { email, password }).then((res) => res.data);

export default loginApi;
