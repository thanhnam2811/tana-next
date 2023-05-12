import Dashboard from '@/pages/dashboard/Dashboard';
import Icon from '@ant-design/icons';
import { BreadcrumbProps, MenuProps } from 'antd';
import { IoPeopleOutline, IoPersonOutline, IoShieldOutline } from 'react-icons/io5';
import { RiHome4Line, RiShieldUserLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export interface LayoutData {
	path: string;
	title: string;
	icon?: React.ReactNode;
	element?: React.ReactNode;
	children?: LayoutData[];
}

export const layoutData: LayoutData[] = [
	{
		path: 'dashboard',
		title: 'Trang chủ',
		icon: <Icon component={RiHome4Line} />,
		element: <Dashboard />,
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
				element: <div>User</div>,
			},
			{
				path: 'admin',
				title: 'Quản trị viên',
				icon: <Icon component={RiShieldUserLine} />,
				element: <div>Admin</div>,
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

export const getLayoutMenuItems = (data = layoutData) => {
	const items: MenuProps['items'] = [];

	for (const item of data) {
		items.push({
			key: item.path,
			icon: item.icon,
			label: item.title,
			children: item.children && getLayoutMenuItems(item.children),
		});
	}

	return items;
};

const findLayoutItem = (path: string, parentChildren?: LayoutData[]): LayoutData | null => {
	const item = parentChildren?.find((item) => item.path === path);

	return item || null;
};

export const getBreadcrumbItems = (pathname: string) => {
	const items: BreadcrumbProps['items'] = [];

	const layoutItems: LayoutData[] = [];
	const paths = pathname.split('/').filter((path) => path);
	const length = paths.length;

	for (let i = 0; i < length; i++) {
		const path = paths[i];
		const parent = i === 0 ? layoutData : layoutItems[i - 1].children;
		const layoutItem = findLayoutItem(path, parent);
		if (!layoutItem) continue;

		const isLast = i === length - 1;
		const breadcrumbPath = '/' + paths.slice(0, i + 1).join('/');
		const breadcrumbItem = {
			key: breadcrumbPath,
			title: isLast ? (
				<>
					{layoutItem.icon} {layoutItem.title}
				</>
			) : (
				<Link to={breadcrumbPath}>
					{layoutItem.icon} {layoutItem.title}
				</Link>
			),
			// menu: { items: getLayoutMenuItems(parent) },
		};

		layoutItems.push(layoutItem);
		items.push(breadcrumbItem);
	}

	// Add dashboard breadcrumb item (Always at first position)
	if (!paths.includes('dashboard')) {
		const dashboardItem = layoutData[0];
		items.unshift({
			key: dashboardItem.path,
			title: (
				<Link to={dashboardItem.path}>
					{dashboardItem.icon} {dashboardItem.title}
				</Link>
			),
		});
	}

	return items;
};
