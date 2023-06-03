import { withAuth } from '@modules/auth/components';
import { WhiteBox } from '@components/Box';
import { FriendTab, InfoTab, PostTab } from '@components/Profile/tabs';
import { Navigate } from '@components/Tab';
import { Content, Sider, withLayout } from '@layout/v2';
import { CircularProgress } from '@mui/material';
import { useAuth } from '@modules/auth/hooks';
import { userApi } from '@utils/api';
import { Layout } from 'antd';
import { useRouter } from 'next/router';
import { ComponentType, Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiInformationCircle, HiUsers, HiViewGrid } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';

type tabType = 'posts' | 'friends' | 'media' | 'about';

export const tabData: {
	label: string;
	Icon: IconType;
	tab: tabType;
	TabContent: ComponentType<{ user: any }>;
}[] = [
	{
		label: 'Bài viết',
		Icon: HiViewGrid,
		tab: 'posts',
		TabContent: PostTab,
	},
	{
		label: 'Bạn bè',
		Icon: HiUsers,
		tab: 'friends',
		TabContent: FriendTab,
	},
	{
		label: 'Thông tin',
		Icon: HiInformationCircle,
		tab: 'about',
		TabContent: InfoTab,
	},
];

function ProfilePage() {
	const router = useRouter();
	const { id, tab = 'posts' } = router.query as { id: string; tab: tabType };
	const TabContent = tabData.find((item) => item.tab === tab)?.TabContent;

	const changeTab = (tab: string) => {
		const query = router.query;
		query.tab = tab;
		router.push({ pathname: router.pathname, query });
	};

	const { authUser } = useAuth();

	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				// if id is provided, get user by id
				if (id) {
					const res = await userApi.get(id);
					setUser(res.data);
				}
				// else get current user
				else {
					setUser(authUser);
				}
			} catch (error: any) {
				toast.error(error?.toString());
			}
			setLoading(false);
		};
		fetchUser();
	}, [id]);

	return (
		<Layout hasSider>
			<Sider fixed align="left">
				<WhiteBox>
					<Navigate.Tabs
						value={tab}
						onChange={(e, value) => changeTab(value)}
						orientation="vertical"
						sx={{
							'& svg.MuiTab-iconWrapper': {
								mb: 0,
								width: 24,
								height: 24,
								mr: 1,
							},
						}}
					>
						{tabData.map(({ label, Icon, tab }) => (
							<Navigate.Tab key={tab} label={label} value={tab} icon={<Icon />} />
						))}
					</Navigate.Tabs>
				</WhiteBox>
			</Sider>

			{/* Summary */}
			<Content>
				{loading ? <CircularProgress /> : <Suspense>{TabContent && <TabContent user={user} />}</Suspense>}
			</Content>
		</Layout>
	);
}

export default withAuth(withLayout(ProfilePage));
