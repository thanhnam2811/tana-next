import { withAuth } from '@components/Auth';
import { WhiteBox } from '@components/Box';
import { FriendTab, InfoTab, PostTab } from '@components/Profile/tabs';
import { Navigate } from '@components/Tab';
import { ContainerArea, LeftArea } from '@layout/Area';
import { CircularProgress } from '@mui/material';
import { useUserStore } from '@store';
import { userApi } from '@utils/api';
import { useRouter } from 'next/router';
import { ComponentType, Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiInformationCircle, HiUsers, HiViewGrid } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import { withLayout } from '@layout/v2';

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

	const { user: currentUser } = useUserStore();

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
					setUser(currentUser);
				}
			} catch (error: any) {
				toast.error(error?.toString());
			}
			setLoading(false);
		};
		fetchUser();
	}, [id]);

	return (
		<ContainerArea>
			<LeftArea fixed>
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
			</LeftArea>

			{/* Summary */}
			{loading ? <CircularProgress /> : <Suspense>{TabContent && <TabContent user={user} />}</Suspense>}
		</ContainerArea>
	);
}

export default withAuth(withLayout(ProfilePage));
