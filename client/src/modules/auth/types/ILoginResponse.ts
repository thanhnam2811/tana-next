import { UserType } from '@common/types';

export interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserType;
}
