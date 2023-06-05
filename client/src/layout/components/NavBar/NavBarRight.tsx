import { useAuth } from '@modules/auth/hooks';
import { useTheme } from '@modules/theme/hooks';
import { Avatar, Badge, Button, Dropdown, MenuProps } from 'antd';
import Link from 'next/link';
import { HiLogout } from 'react-icons/hi';
import { HiBell, HiCog6Tooth, HiExclamationTriangle, HiMoon, HiSun, HiUser } from 'react-icons/hi2';
import { HeaderRight } from '../Header';

export function NavBarRight() {
	const { authUser, logout } = useAuth();
	const { mode, toggleTheme } = useTheme();

	if (!authUser)
		return (
			<HeaderRight>
				<Link href="/auth/login" draggable>
					<Button type="primary">Đăng nhập</Button>
				</Link>

				<Link href="/auth/register" draggable>
					<Button>Đăng ký</Button>
				</Link>
			</HeaderRight>
		);

	const avatarDropdownItems: MenuProps['items'] = [
		{
			key: 'profile',
			label: 'Trang cá nhân',
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
			icon: mode === 'dark' ? <HiMoon /> : <HiSun />,
			onClick: toggleTheme,
		},
		{
			key: 'report',
			label: 'Báo cáo sự cố',
			icon: <HiExclamationTriangle />,
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
			<Badge count={5} offset={[-4, 4]}>
				<Button shape="circle" size="large">
					<HiBell />
				</Button>
			</Badge>

			<Dropdown menu={{ items: avatarDropdownItems }} arrow>
				<Button shape="circle" size="large">
					<Avatar src={authUser?.profilePicture.link} />
				</Button>
			</Dropdown>
		</HeaderRight>
	);
}
