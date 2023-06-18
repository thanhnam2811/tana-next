import { UserType } from '@modules/user/types';

export interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserType;
}
