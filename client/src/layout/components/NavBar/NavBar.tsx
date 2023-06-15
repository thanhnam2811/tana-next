import Layout from '@layout/components';
import { useAuth } from '@modules/auth/hooks';
import { Button, theme, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/router';
import { FiHome, FiMessageSquare, FiUser, FiUsers } from 'react-icons/fi';
import styles from '../../styles/Layout.module.scss';
import { HeaderCenter, HeaderRight } from '../Header';
import { NavBarLeft } from './NavBarLeft';
import { NavBarRight } from './NavBarRight';
import Link from 'next/link';

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

export default function NavBar() {
	const { authUser } = useAuth();
	const router = useRouter();
	const { token } = theme.useToken();

	return (
		<Layout.Header>
			<NavBarLeft />

			<HeaderCenter>
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
									className={classes.join(' ')}
									type="text"
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
			</HeaderCenter>

			{authUser ? (
				<NavBarRight />
			) : (
				<HeaderRight>
					<Link href="/auth/login" draggable>
						<Button type="primary">Đăng nhập</Button>
					</Link>

					<Link href="/auth/register" draggable>
						<Button>Đăng ký</Button>
					</Link>
				</HeaderRight>
			)}
		</Layout.Header>
	);
}
