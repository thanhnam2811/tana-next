import Reaction from '@assets/icons/reactions';
import { ContactType, EducationType, PrivacyValueType, ReactionType, WorkType } from '@common/types';
import { COLORS } from '@utils/theme';
import { HiGlobeAsiaAustralia, HiLockClosed, HiUserMinus, HiUserPlus, HiUsers } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export interface IOption<T> {
	label: string;
	value: T;
	RIcon?: IconType;
}

export type PrivacyOptionType = Required<IOption<PrivacyValueType>>;
export const privacyOptions: PrivacyOptionType[] = [
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
	{
		value: 'includes',
		label: 'Bạn bè bao gồm',
		RIcon: HiUserPlus,
	},
	{
		value: 'excludes',
		label: 'Bạn bè ngoại trừ',
		RIcon: HiUserMinus,
	},
];
export const getPrivacyOption = (value: PrivacyValueType = 'public') =>
	privacyOptions.find((option) => option.value === value);

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

export const reactOptions: (IOption<ReactionType> & {
	color: string;
	img: string;
})[] = [
	{
		color: COLORS.info,
		img: Reaction.Like.src,
		label: 'Thích',
		value: 'like',
	},
	{
		color: COLORS.love,
		img: Reaction.Love.src,
		label: 'Yêu thích',
		value: 'love',
	},
	{
		color: COLORS.warning,
		img: Reaction.Haha.src,
		label: 'Haha',
		value: 'haha',
	},
	{
		color: COLORS.warning,
		img: Reaction.Wow.src,
		label: 'Wow',
		value: 'wow',
	},
	{
		color: COLORS.gray,
		img: Reaction.Sad.src,
		label: 'Buồn',
		value: 'sad',
	},
	{
		color: COLORS.error,
		img: Reaction.Angry.src,
		label: 'Phẫn nộ',
		value: 'angry',
	},
];
