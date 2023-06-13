import Icon from '@ant-design/icons';
import { IoPeopleOutline, IoPersonOutline, IoShieldOutline } from 'react-icons/io5';
import { RiHome4Line, RiShieldUserLine } from 'react-icons/ri';
import { ILayoutData } from '@layout/types';

import UserPage from '@modules/account/user/pages/UserPage';
import AdminPage from '@modules/account/admin/pages/AdminPage';
import DashboardPage from '@modules/dashboard/pages/Dashboard';

export const layoutData: ILayoutData[] = [
	{
		path: 'dashboard',
		title: 'Trang chủ',
		icon: <Icon component={RiHome4Line} />,
		element: <DashboardPage />,
	},
	{
		path: 'account',
		title: 'Tài khoản',
		icon: <Icon component={IoPeopleOutline} />,
		children: [
			{
				path: 'user',
				title: 'Người dùng',
				icon: <Icon component={IoPersonOutline} />,
				element: <UserPage />,
			},
			{
				path: 'admin',
				title: 'Quản trị viên',
				icon: <Icon component={RiShieldUserLine} />,
				element: <AdminPage />,
			},
			{
				path: 'role',
				title: 'Quyền',
				icon: <Icon component={IoShieldOutline} />,
				element: <div>Role</div>,
			},
		],
	},
];