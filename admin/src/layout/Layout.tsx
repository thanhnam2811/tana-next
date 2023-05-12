import { authApi } from '@/api';
import { useAuthStore, useThemeStore } from '@/store';
import Icon, { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {
	Layout as AntdLayout,
	Badge,
	Breadcrumb,
	Button,
	Dropdown,
	Menu,
	MenuProps,
	Space,
	Switch,
	message,
	theme,
} from 'antd';
import { useState } from 'react';
import {
	IoLogOutOutline,
	IoMailOutline,
	IoNotificationsOutline,
	IoPersonCircleOutline,
	IoPersonOutline,
	IoSettingsOutline,
} from 'react-icons/io5';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getBreadcrumbItems, getLayoutMenuItems } from '.';
import styles from './Layout.module.scss';

const { Sider, Header, Content } = AntdLayout;
const menuItems = getLayoutMenuItems();

export function Layout() {
	const { isAuth, logout } = useAuthStore();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [collapsed, setCollapsed] = useState(true);
	const { token } = theme.useToken();
	const { colorBgBase } = token;
	const { mode, toggleTheme } = useThemeStore();

	if (!isAuth) return <Navigate to="/login" replace state={{ from: pathname }} />;

	const handleLogout = () => {
		authApi.logout();
		logout();
	};

	const userDropdownItems: MenuProps['items'] = [
		{
			key: 'setting',
			label: 'Cài đặt',
			icon: <Icon component={IoSettingsOutline} />,
			onClick: () => message.info('Chức năng đang phát triển'),
		},
		{
			key: 'account',
			label: 'Tài khoản',
			icon: <Icon component={IoPersonCircleOutline} />,
			onClick: () => message.info('Chức năng đang phát triển'),
		},
		{
			key: 'logout',
			label: 'Đăng xuất',
			icon: <Icon component={IoLogOutOutline} />,
			onClick: handleLogout,
		},
	];

	const selectedKeys = pathname.split('/').slice(1).reverse();
	const onMenuSelect = ({ keyPath }: { keyPath: string[] }) => {
		const path = '/' + keyPath.reverse().join('/');

		navigate(path);
	};

	const breadcrumbItems = getBreadcrumbItems(pathname);

	return (
		<AntdLayout className={styles.layout}>
			<Sider
				className={styles.sider}
				collapsible
				trigger={null}
				collapsed={collapsed}
				style={{ backgroundColor: colorBgBase }}
			>
				<Space className={styles.logo}>
					<img src="/tana.svg" alt="logo" />
					{!collapsed && <span>Admin TaNa</span>}
				</Space>

				<Menu
					mode="inline"
					selectedKeys={selectedKeys}
					items={menuItems}
					onSelect={onMenuSelect}
					className={styles.menu}
				/>
			</Sider>

			<AntdLayout>
				<Header className={styles.header} style={{ backgroundColor: colorBgBase }}>
					{/* Left */}
					<Space>
						<Button
							type="text"
							icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							onClick={() => setCollapsed(!collapsed)}
							size="large"
						/>
						<Breadcrumb items={breadcrumbItems} />
					</Space>

					{/* Right */}
					<Space style={{ float: 'right' }}>
						<Switch
							className={styles.theme_switch}
							checkedChildren={<Icon component={RiMoonFill} className={styles.theme_icon} />}
							unCheckedChildren={<Icon component={RiSunFill} className={styles.theme_icon} />}
							checked={mode === 'dark'}
							onChange={toggleTheme}
						/>

						<Badge count={5}>
							<Button type="text" icon={<Icon component={IoMailOutline} />} size="large" shape="circle" />
						</Badge>

						<Badge count={5}>
							<Button
								type="text"
								icon={<Icon component={IoNotificationsOutline} />}
								size="large"
								shape="circle"
							/>
						</Badge>

						<Dropdown menu={{ items: userDropdownItems }} trigger={['click']} arrow>
							<Button
								type="text"
								icon={<Icon component={IoPersonOutline} />}
								size="large"
								shape="circle"
							/>
						</Dropdown>
					</Space>
				</Header>
				<Content className={styles.content}>
					<Outlet />
				</Content>
			</AntdLayout>
		</AntdLayout>
	);
}
