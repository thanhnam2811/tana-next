export interface IPrivacy {
	value: PrivacyType;
	includes?: string[];
	excludes?: string[];
}

export type PrivacyType = 'public' | 'private' | 'friends';

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

export type EducationType = 'primary' | 'secondary' | 'high' | 'university' | 'master' | 'doctor';

export type WorkType = 'intern' | 'parttime' | 'fulltime';
