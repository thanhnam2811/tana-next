import { ContactType, EducationType, PrivacyType, WorkType } from '@interfaces';
import { HiGlobeAsiaAustralia, HiLockClosed, HiUsers } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export interface IOption<T> {
	label: string;
	value: T;
	RIcon?: IconType;
}

export const privacyOptions: Required<IOption<PrivacyType>>[] = [
	{
		value: 'public',
		label: 'Công khai',
		RIcon: HiGlobeAsiaAustralia,
	},
	{
		value: 'private',
		label: 'Chỉ mình tôi',
		RIcon: HiLockClosed,
	},
	{
		value: 'friends',
		label: 'Bạn bè',
		RIcon: HiUsers,
	},
];
export const getPrivacyOption = (value: PrivacyType = 'public') =>
	privacyOptions.find((option) => option.value === value)!;

export const contactOptions: IOption<ContactType>[] = [
	{
		value: 'phone',
		label: 'Điện thoại',
	},
	{
		value: 'email',
		label: 'Email',
	},
	{
		value: 'facebook',
		label: 'Facebook',
	},
	{
		value: 'twitter',
		label: 'Twitter',
	},
	{
		value: 'instagram',
		label: 'Instagram',
	},
	{
		value: 'github',
		label: 'Github',
	},
	{
		value: 'linkedin',
		label: 'Linkedin',
	},
	{
		value: 'youtube',
		label: 'Youtube',
	},
	{
		value: 'website',
		label: 'Website',
	},
];

export const educationOptions: IOption<EducationType>[] = [
	{
		value: 'primary',
		label: 'Tiểu học',
	},
	{
		value: 'secondary',
		label: 'Trung học cơ sở',
	},
	{
		value: 'high',
		label: 'Trung học phổ thông',
	},
	{
		value: 'university',
		label: 'Đại học',
	},
	{
		value: 'master',
		label: 'Thạc sĩ',
	},
	{
		value: 'doctor',
		label: 'Tiến sĩ',
	},
];

export const workOptions: IOption<WorkType>[] = [
	{
		value: 'intern',
		label: 'Thực tập',
	},
	{
		value: 'parttime',
		label: 'Bán thời gian',
	},
	{
		value: 'fulltime',
		label: 'Toàn thời gian',
	},
];
