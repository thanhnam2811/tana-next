export interface IPrivacy {
	value: PrivacyValueType;
	includes?: string[];
	excludes?: string[];
}

export type PrivacyValueType = 'public' | 'private' | 'friends' | 'includes' | 'excludes';
