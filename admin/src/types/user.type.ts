export interface IPicture {
	_id: string;
	link: string;
}

export interface IRole {
	_id: string;
	name: string;
}

export interface IFriend {
	user: IUser;
	date: string;
}

interface IUser {
	_id: string;
	fullname: string;
	email: string;
	isOnline: boolean;
	profilePicture: IPicture;
	coverPicture?: IPicture;
	role: IRole;
	// education: any[];
	// work: any[];
	// contact: any[];
	friendRequests: IFriend[];
	sentRequests: IFriend[];
	friends: IFriend[];
	followers: IFriend[];
	followings: IFriend[];
	createdAt: string;
	updatedAt: string;
}

export type UserType = IUser; // for use
export type UserFormType = IUser; // for form
