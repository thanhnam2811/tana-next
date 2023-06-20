import Icon, { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {
	Badge,
	Breadcrumb,
	Button,
	Dropdown,
	Layout as AntdLayout,
	Menu,
	MenuProps,
	message,
	Space,
	Switch,
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
import styles from './styles/Layout.module.scss';
import { useTheme } from '@layout/hooks';
import { getBreadcrumbItems, getLayoutMenuItems } from './utils';
import { useAuth } from '@modules/auth/hooks';

const { Sider, Header, Content } = AntdLayout;
const menuItems = getLayoutMenuItems();

export default function Layout() {
	const { user, logout } = useAuth();
	const isAuth = !!user;

	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [collapsed, setCollapsed] = useState(true);
	const { token } = theme.useToken();
	const { colorBgBase } = token;
	const { mode, toggleTheme } = useTheme();

	if (!isAuth) return <Navigate to="/login" replace state={{ from: pathname }} />;

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
			onClick: logout,
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
