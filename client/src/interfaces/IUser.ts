import { ContactType, EducationType, IPrivacy } from './IPrivacy';
import { IMedia } from './common';

export interface IContact {
	type: ContactType;
	value: string;
	privacy: IPrivacy;
}

export interface IWork {
	// type: WorkType;
	company: string;
	position: string;
	from: string;
	to?: string;
	privacy: IPrivacy;
}

export interface IEducation {
	type: EducationType;
	school: string;
	major: string;
	degree: string;
	from?: string;
	to?: string;
	privacy: IPrivacy;
}

export interface IUser {
	_id: string;
	fullname: string;
	email: string;

	profilePicture: IMedia | string;
	coverPicture: IMedia | string;

	isOnline: boolean;
	lastAccess: string;

	contact: IContact[];
	work: IWork[];
	education: IEducation[];
}

export type UserType = IUser & {
	profilePicture: IMedia;
	coverPicture: IMedia;
};

export type UserFormType = Partial<
	IUser & {
		profilePicture: string;
		coverPicture: string;
	}
>;
