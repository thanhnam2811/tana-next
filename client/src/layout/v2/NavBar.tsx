import { Logo } from '@assets/logo';
import { useUserStore } from '@store';
import { Avatar, Badge, Button, Layout, Tooltip, theme } from 'antd';
import { useRouter } from 'next/router';
import { FiHome, FiMessageSquare, FiUser, FiUsers } from 'react-icons/fi';
import { HiBell } from 'react-icons/hi2';
import styles from './Layout.module.scss';

const items = [
	{
		label: 'Trang chủ',
		RIcon: FiHome,
		path: '/home',
	},
	{
		label: 'Bạn bè',
		RIcon: FiUsers,
		path: '/friends',
	},
	{
		label: 'Tin nhắn',
		RIcon: FiMessageSquare,
		path: '/messages',
	},
	{
		label: 'Trang cá nhân',
		RIcon: FiUser,
		path: '/profile',
	},
];

export function NavBar() {
	const { user } = useUserStore();
	const router = useRouter();
	const { token } = theme.useToken();

	const handleLogoClick = () => {
		router.push('/');
	};

	return (
		<Layout hasSider className={styles.nav}>
			<Layout.Sider className={styles.nav_left}>
				<Button shape="circle" size="large" onClick={handleLogoClick}>
					<Avatar src={Logo.src} />
				</Button>
			</Layout.Sider>

			<Layout.Content className={styles.nav_content}>
				{items.map((page) => {
					const isCurrentPage = router.pathname.startsWith(page.path);

					const classes = [styles.nav_button];
					if (isCurrentPage) classes.push(styles.nav_button_active);

					return (
						<Tooltip key={page.path} title={page.label} mouseEnterDelay={1}>
							<Button
								size="large"
								onClick={() => router.push(page.path)}
								icon={<page.RIcon />}
								type="text"
								className={classes.join(' ')}
								style={{
									color: isCurrentPage ? token.colorPrimary : token.colorBorder,
								}}
							/>
						</Tooltip>
					);
				})}
			</Layout.Content>

			<Layout.Sider className={styles.nav_right}>
				<Badge count={5} offset={[-4, 4]}>
					<Button shape="circle" size="large">
						<HiBell />
					</Button>
				</Badge>

				<Button shape="circle" size="large">
					<Avatar src={user?.profilePicture.link} />
				</Button>
			</Layout.Sider>
		</Layout>
	);
}
