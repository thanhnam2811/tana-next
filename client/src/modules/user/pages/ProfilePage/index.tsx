import { swrFetcher } from '@common/api';
import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { useAuth } from '@modules/auth/hooks';
import { UserProvider } from '@modules/user/hooks';
import { UserType } from '@modules/user/types';
import { Card, Menu, Spin } from 'antd';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { HiInformationCircle, HiUsers, HiViewGrid } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import useSWR from 'swr';
import { FriendTab, InfoTab, PostTab } from './tabs';

type TabType = 'posts' | 'friends' | 'media' | 'about';
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
];

function Index() {
	const { authUser } = useAuth();
	const router = useRouter();
	const { id = authUser?._id, tab = 'posts' } = router.query as { id: string; tab: TabType };
	const tabItem = tabList.find((item) => item.tab === tab);

	const { isLoading, data: user } = useSWR<UserType>(`/users/${id}`, swrFetcher);

	const changeTab = async (tab: string) => {
		const query = router.query;
		query.tab = tab;
		await router.push({ pathname: router.pathname, query });
	};

	if (!user)
		return (
			<Layout.Content
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{isLoading ? <Spin size="large" /> : 'Không tìm thấy người dùng'}
			</Layout.Content>
		);

	return (
		<UserProvider value={{ user }}>
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
