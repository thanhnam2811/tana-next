import { IconType } from 'react-icons/lib';
import { GenderLabel, GenderValue } from '../types';
import { IoFemale, IoMale, IoMaleFemale } from 'react-icons/io5';

export interface IGenderOption {
	value: GenderValue;
	label: GenderLabel;
	Icon: IconType;
}

export const genderOptions: IGenderOption[] = [
	{
		value: 'male',
		label: 'nam',
		Icon: IoMale,
	},
	{
		value: 'female',
		label: 'nữ',
		Icon: IoFemale,
	},
	{
		value: 'other',
		label: 'khác',
		Icon: IoMaleFemale,
	},
];
