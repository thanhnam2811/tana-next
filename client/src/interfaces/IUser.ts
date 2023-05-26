import { ContactType, EducationType, IPrivacy } from './IPrivacy';

export interface IPicture {
	_id: string;
	link: string;
}

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
	profilePicture: IPicture;
	coverPicture: IPicture;
	isOnline: boolean;

	contact: IContact[];
	work: IWork[];
	education: IEducation[];
}
