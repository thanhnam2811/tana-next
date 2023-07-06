import { IData, IMedia, IPrivacy } from '@common/types';
import { IGender } from './IGender';

export type ContactType =
	| 'phone'
	| 'email'
	| 'facebook'
	| 'twitter'
	| 'instagram'
	| 'github'
	| 'linkedin'
	| 'youtube'
	| 'website';

export interface IContact {
	type: ContactType;
	value: string;
	privacy: IPrivacy;
}

export type WorkType = 'intern' | 'parttime' | 'fulltime';

export interface IWork {
	// type: WorkType;
	company: string;
	position: string;
	from: string;
	to?: string;
	privacy: IPrivacy;
}

export type EducationType = 'primary' | 'secondary' | 'high' | 'university' | 'master' | 'doctor';

export interface IEducation {
	type: EducationType;
	school: string;
	major: string;
	degree: string;
	from?: string;
	to?: string;
	privacy: IPrivacy;
}

export type RelationshipType = 'friend' | 'sent' | 'received' | 'none' | 'you';

interface IUser extends IData {
	fullname: string;
	email: string;
	gender?: IGender;

	profilePicture: IMedia | string;
	coverPicture: IMedia | string;

	isOnline: boolean;
	lastAccess?: string;
	shouldSetPassword?: boolean; // For login with 3rd party

	relationship?: RelationshipType;

	contact: IContact[];
	work: IWork[];
	education: IEducation[];

	// Lock
	isPermanentlyLocked?: boolean;
	lockTime?: string;
	reasonLock?: string;
}

// For use
export type UserType = IUser & {
	profilePicture: IMedia;
	coverPicture: IMedia;
};

// For form
export type UserFormType = Partial<
	IUser & {
		profilePicture: string;
		coverPicture: string;
	}
>;
