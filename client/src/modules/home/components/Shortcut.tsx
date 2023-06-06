import { useAuth } from '@modules/auth/hooks';
import { UserAvatar } from '@modules/user/components';
import { Button, Divider, List, Space, Typography } from 'antd';
import Link from 'next/link';
import {
	FcAbout,
	FcCustomerSupport,
	FcFeedback,
	FcInfo,
	FcPrivacy,
	FcReading,
	FcRefresh,
	FcSettings,
	FcSportsMode,
} from 'react-icons/fc';
import { IconType } from 'react-icons/lib';

interface Action {
	title: string;
	icon: IconType;
	onClick?: () => void;
	href?: string;
}

export function ShortCut() {
	const { authUser, logout } = useAuth();

	const listAccountAction: Action[] = [
		{
			title: 'Chuyển tài khoản',
			icon: FcRefresh,
		},
		{
			title: 'Đăng xuất',
			icon: FcSportsMode,
			onClick: logout,
		},
	];

	const listShortCutAction: Action[] = [
		{
			title: 'Cài đặt',
			icon: FcSettings,
			href: '/settings',
		},
		{
			title: 'Trợ giúp',
			icon: FcCustomerSupport,
			href: '/help',
		},
		{
			title: 'Báo cáo sự cố',
			icon: FcFeedback,
			href: '/report',
		},
		{
			title: 'Giới thiệu',
			icon: FcAbout,
			href: '/about',
		},
		{
			title: 'Điều khoản',
			icon: FcReading,
			href: '/terms',
		},
		{
			title: 'Quyền riêng tư',
			icon: FcInfo,
			href: '/privacy',
		},
		{
			title: 'Bảo mật',
			icon: FcPrivacy,
			href: '/security',
		},
	];

	const lists = [
		{
			title: 'Tài khoản',
			data: listAccountAction,
		},
		{
			title: 'Lối tắt',
			data: listShortCutAction,
		},
	];

	return (
		<Space direction="vertical" style={{ overflow: 'auto' }}>
			<Link href={`/profile?id=${authUser?._id}`} draggable style={{ width: '100%' }}>
				<Button type="text" block style={{ height: 'auto', padding: '8px' }}>
					<Space align="center" style={{ width: '100%' }}>
						<UserAvatar user={authUser!} avtSize={36} />

						<Typography.Text strong>{authUser?.fullname}</Typography.Text>
					</Space>
				</Button>
			</Link>

			{lists.map((list, index) => (
				<List
					key={index}
					header={
						<Divider orientation="left" style={{ margin: 0 }}>
							<Typography.Title level={4} style={{ margin: 0 }}>
								{list.title}
							</Typography.Title>
						</Divider>
					}
					split={false}
					dataSource={list.data}
					renderItem={(item) => (
						<List.Item style={{ padding: '4px 0' }}>
							<Link href={item.href ?? '#'} draggable style={{ width: '100%' }}>
								<Button
									type="text"
									block
									style={{ height: 'auto', padding: '8px' }}
									onClick={item.onClick}
								>
									<Space align="center" style={{ width: '100%' }}>
										<item.icon size={20} />

										<Typography.Text strong>{item.title}</Typography.Text>
									</Space>
								</Button>
							</Link>
						</List.Item>
					)}
				/>
			))}
		</Space>
	);
}
