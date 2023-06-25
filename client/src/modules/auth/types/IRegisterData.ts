export interface IRegisterData {
	fullname: string;
	email: string;
	otp: string;
	password: string;
}

export type RegisterAccount = Pick<IRegisterData, 'email' | 'fullname'>;

export type RegisterPassword = Pick<IRegisterData, 'otp' | 'password'>;
