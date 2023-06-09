import { useFetcher } from '@common/hooks';
import { useAuth } from '@modules/auth/hooks';
import { NotificationType } from '@modules/notification/types';
import { useTheme } from '@modules/theme/hooks';
import { UserAvatar } from '@modules/user/components';
import { getTimeAgo } from '@utils/common';
import { Avatar, Badge, Button, Card, Dropdown, List, MenuProps, Space, Typography } from 'antd';
import Link from 'next/link';
import { HiLogout } from 'react-icons/hi';
import { HiBell, HiCog6Tooth, HiExclamationTriangle, HiMoon, HiSun, HiUser } from 'react-icons/hi2';
import { HeaderRight } from '../Header';
import { useReport } from '@modules/report/hooks';

export function NavBarRight() {
	const { authUser, logout } = useAuth();
	const { mode, toggleTheme } = useTheme();
	const notiFetcher = useFetcher<NotificationType>({ api: `/users/notifications` });
	const { openReport } = useReport({ type: 'bug' });

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
			<Dropdown
				arrow
				dropdownRender={() => (
					<Card
						title="Thông báo"
						extra={<Button type="link">Đánh dấu tất cả là đã xem</Button>}
						style={{ width: 400 }}
						bodyStyle={{ maxHeight: 400, overflow: 'hidden auto', padding: 8 }}
						headStyle={{ padding: 16 }}
					>
						<List
							dataSource={notiFetcher.data}
							split={false}
							renderItem={(noti) => (
								<Link href={noti.link}>
									<Button
										type="text"
										style={{ height: 'auto', width: '100%', justifyContent: 'flex-start' }}
									>
										<Space align="start">
											<UserAvatar user={noti.sender} size={40} />

											<Space direction="vertical" align="start" style={{ textAlign: 'justify' }}>
												<Typography.Text strong style={{ whiteSpace: 'break-spaces' }}>
													{noti.content}
												</Typography.Text>
												<Typography.Text type="secondary">
													{getTimeAgo(noti.createdAt)}
												</Typography.Text>
											</Space>
										</Space>
									</Button>
								</Link>
							)}
						/>
					</Card>
				)}
			>
				<Badge count={5} offset={[-4, 4]}>
					<Button shape="circle" size="large">
						<HiBell />
					</Button>
				</Badge>
			</Dropdown>

			<Dropdown menu={{ items: avatarDropdownItems }} arrow>
				<Button shape="circle" size="large">
					<Avatar src={authUser?.profilePicture.link} />
				</Button>
			</Dropdown>
		</HeaderRight>
	);
}
