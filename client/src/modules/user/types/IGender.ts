import { IPrivacy } from '@common/types';

export type GenderValue = 'male' | 'female' | 'other';
export type GenderLabel = 'nam' | 'nữ' | 'khác';

export interface IGender {
	value: GenderValue;
	label: GenderLabel;
	privacy: IPrivacy;
}
