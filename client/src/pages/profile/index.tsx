import { withAuth } from '@components/Auth';
import { WhiteBox } from '@components/Box';
import { Navigate } from '@components/Tab';
import { useAuth } from '@hooks';
import { ContainerArea, LeftArea } from '@layout';
import { Box, CircularProgress } from '@mui/material';
import { userApi } from '@utils';
import { useRouter } from 'next/router';
import React, { ComponentType, Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiInformationCircle, HiUsers, HiViewGrid } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';

// import { FriendTab, PostTab } from '@components/Profile/tabs';
const FriendTab = React.lazy(() =>
	import('@components/Profile/tabs').then((module) => ({ default: module.FriendTab }))
);
const PostTab = React.lazy(() => import('@components/Profile/tabs').then((module) => ({ default: module.PostTab })));

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
	// {
	// 	label: 'Ảnh, video',
	// 	Icon: HiPhotograph,
	// 	tab: 'media',
	// },
	{
		label: 'Thông tin',
		Icon: HiInformationCircle,
		tab: 'about',
		TabContent: () => <Box>About</Box>,
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

	const { user: currentUser } = useAuth();

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
			{loading ? (
				<CircularProgress />
			) : (
				TabContent && (
					<Suspense>
						<TabContent user={user} />
					</Suspense>
				)
			)}
		</ContainerArea>
	);
}

export default withAuth(ProfilePage);
