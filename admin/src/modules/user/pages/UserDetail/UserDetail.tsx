import useSWR from 'swr';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { swrFetcher } from '@common/api';
import { Avatar, Card } from 'antd';
import { UserType } from '@modules/user/types';
import { FullscreenSpin } from '@common/components/Loading';
import { CardTabListType } from 'antd/lib/card';
import React from 'react';

import ProfileTab from '@modules/user/pages/UserDetail/tabs/ProfileTab.tsx';
import AdvancedTab from '@modules/user/pages/UserDetail/tabs/AdvancedTab.tsx';
import HistoryTab from '@modules/user/pages/UserDetail/tabs/HistoryTab.tsx';

export default function UserDetail() {
	const { id } = useParams();
	const { data: user, isLoading, error } = useSWR<UserType, string>(`users/${id}`, swrFetcher);

	const [params, setParams] = useSearchParams({ tab: 'profile' });
	const tab = params.get('tab');

	if (isLoading) return <FullscreenSpin />;

	if (error) return <div>{error}</div>;

	if (!user) return <Navigate to="/404" />;

	const tabList: (CardTabListType & { content: React.ReactNode })[] = [
		{
			key: 'profile',
			tab: 'Thông tin',
			content: <ProfileTab user={user} />,
		},
		{
			key: 'advanced',
			tab: 'Nâng cao',
			content: <AdvancedTab user={user} />,
		},
		{
			key: 'history',
			tab: 'Lịch sử hoạt động',
			content: <HistoryTab user={user} />,
		},
	];
	const currentTab = tabList.find((t) => t.key === tab);

	return (
		<Card
			title={
				<Card.Meta
					avatar={<Avatar src={user.profilePicture.link} alt={user.fullname} />}
					title={user.fullname}
					description={user.email}
				/>
			}
			loading={isLoading}
			tabList={tabList}
			activeTabKey={currentTab?.key}
			onTabChange={(key) => setParams({ tab: key })}
		>
			{currentTab?.content}
		</Card>
	);
}
