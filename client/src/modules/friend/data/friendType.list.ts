import { HiSparkles, HiUserGroup, HiUserPlus, HiUsers } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { FriendType } from '../types';

type IFriendList = {
	type: FriendType;
	title: string;
	Icon: IconType;
}[];

export const friendTypeList: IFriendList = [
	{
		title: 'Bạn bè',
		type: 'friends',
		Icon: HiUsers,
	},
	{
		title: 'Lời mời kết bạn',
		type: 'requests',
		Icon: HiUserPlus,
	},
	{
		title: 'Gợi ý',
		type: 'suggests',
		Icon: HiSparkles,
	},
	{
		title: 'Tất cả',
		type: 'all',
		Icon: HiUserGroup,
	},
];
