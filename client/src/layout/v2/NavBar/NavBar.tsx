import { Logo } from '@assets/logo';
import { useAuth } from '@modules/auth/hooks';
import { Avatar, Button, Layout, Tooltip, Typography, theme } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiMessageSquare, FiUser, FiUsers } from 'react-icons/fi';
import styles from '../Layout.module.scss';
import { NavBarRight } from './NavBar.right';

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
	const { authUser } = useAuth();
	const router = useRouter();
	const { token } = theme.useToken();

	return (
		<Layout hasSider className={styles.nav}>
			<Layout.Sider className={styles.nav_left}>
				<Link href="/" style={{ display: 'flex' }}>
					<Button shape="circle" size="large">
						<Avatar src={Logo.src} />
					</Button>
				</Link>
			</Layout.Sider>

			<Layout.Content className={styles.nav_content}>
				{authUser ? (
					items.map((page) => {
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
					})
				) : (
					<Typography.Title level={2} style={{ margin: 0, color: token.colorPrimary }}>
						TaNa - Kết nối và sáng tạo
					</Typography.Title>
				)}
			</Layout.Content>

			<NavBarRight />
		</Layout>
	);
}
