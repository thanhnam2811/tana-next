import { swrFetcher } from '@common/api';
import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { useAuth } from '@modules/auth/hooks';
import { UserProvider } from '@modules/user/hooks';
import { UserType } from '@modules/user/types';
import { Card, Menu, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { HiInformationCircle, HiShieldExclamation, HiUsers, HiViewGrid } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import useSWR from 'swr';
import { FriendTab, InfoTab, PostTab, SecurityTab } from './tabs';
import SEO from '@common/components/SEO';
import ActivityTab from '@modules/user/pages/ProfilePage/tabs/ActivityTab';
import { BiHistory } from 'react-icons/bi';

type TabType = 'posts' | 'friends' | 'media' | 'about' | 'security' | 'activity';

function Index() {
	const { authUser } = useAuth();
	const router = useRouter();
	const { id = authUser?._id, tab = 'posts' } = router.query as { id: string; tab: TabType };

	const { isLoading, data: user } = useSWR<UserType>(`/users/${id}`, swrFetcher);

	const tabList: { label: string; Icon: IconType; tab: TabType; component: ReactNode }[] = [
		{
			label: 'Bài viết',
			Icon: HiViewGrid,
			tab: 'posts',
			component: <PostTab />,
		},
		{
			label: 'Bạn bè',
			Icon: HiUsers,
			tab: 'friends',
			component: <FriendTab />,
		},
		{
			label: 'Thông tin',
			Icon: HiInformationCircle,
			tab: 'about',
			component: <InfoTab />,
		},
		{
			label: 'Hoạt động',
			Icon: BiHistory,
			tab: 'activity',
			component: <ActivityTab />,
		},
	];
	const isAuthUser = authUser?._id === id;
	if (isAuthUser) {
		tabList.push({
			label: 'Bảo mật',
			Icon: HiShieldExclamation,
			tab: 'security',
			component: <SecurityTab />,
		});
	}

	const tabItem = tabList.find((item) => item.tab === tab);
	const changeTab = async (tab: string) => {
		const query = router.query;
		query.tab = tab;
		await router.push({ pathname: router.pathname, query });
	};

	if (!user)
		return (
			<>
				<SEO title="Không tìm thấy người dùng" />

				<Layout.Content
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{isLoading ? <Spin size="large" /> : 'Không tìm thấy người dùng'}
				</Layout.Content>
			</>
		);

	return (
		<UserProvider value={{ user }}>
			<SEO title={[user.fullname, tabItem?.label].filter(Boolean).join(' - ')} />

			<Layout.Sider align="left">
				<Card bodyStyle={{ padding: 8 }}>
					<Menu
						mode="vertical"
						style={{ width: '100%', border: 'none' }}
						items={tabList.map(({ tab, label, Icon }) => ({
							key: tab,
							icon: <Icon size={20} />,
							label: label,
						}))}
						selectedKeys={[tab]}
						onClick={({ key }) => changeTab(key as TabType)}
					/>
				</Card>
			</Layout.Sider>

			<Layout.Content>{tabItem?.component}</Layout.Content>
		</UserProvider>
	);
}

export default withAuth(withLayout(Index));
