import { useAuth } from '@modules/auth/hooks';
import { useTheme } from 'src/layout/hooks';
import { Avatar, Badge, Button, Dropdown, MenuProps } from 'antd';
import { HiLogout } from 'react-icons/hi';
import { HiBell, HiCog6Tooth, HiExclamationTriangle, HiMoon, HiSun, HiUser } from 'react-icons/hi2';
import { HeaderRight } from '../Header';
import { useReport } from '@modules/report/hooks';
import { NotificationPopover } from '@modules/notification/components';
import Link from 'next/link';

export function NavBarRight() {
	const { authUser, logout } = useAuth();
	const { mode, toggleTheme } = useTheme();
	const { openReport } = useReport({ type: 'bug' });

	const avatarDropdownItems: MenuProps['items'] = [
		{
			key: 'profile',
			label: <Link href="/profile">Trang cá nhân</Link>,
			icon: <HiUser />,
		},
		{
			key: 'setting',
			label: 'Cài đặt',
			icon: <HiCog6Tooth />,
		},
		{
			key: 'theme',
			label: `Chế độ ${mode === 'dark' ? 'sáng' : 'tối'}`,
			icon: mode === 'dark' ? <HiSun /> : <HiMoon />,
			onClick: toggleTheme,
		},
		{
			key: 'report',
			label: 'Báo lỗi',
			icon: <HiExclamationTriangle />,
			onClick: openReport,
		},
		{
			key: 'logout',
			label: 'Đăng xuất',
			icon: <HiLogout />,
			onClick: logout,
		},
	];

	return (
		<HeaderRight>
			<NotificationPopover
				renderChildren={(numberUnread) => (
					<Badge count={numberUnread} offset={[-4, 4]}>
						<Button shape="circle" size="large">
							<HiBell />
						</Button>
					</Badge>
				)}
			/>

			<Dropdown menu={{ items: avatarDropdownItems }} arrow trigger={['click']}>
				<Button shape="circle" size="large">
					<Avatar src={authUser?.profilePicture.link} />
				</Button>
			</Dropdown>
		</HeaderRight>
	);
}
