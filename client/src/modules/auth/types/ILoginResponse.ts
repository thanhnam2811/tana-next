import { UserType } from '@interfaces';

export interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserType;
}
