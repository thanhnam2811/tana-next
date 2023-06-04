import { IPaginationResponse, UserType } from '@interfaces';
import { UserAvatar } from '@modules/user/components';
import { swrFetcher, userApi } from '@utils/api';
import { Button, Divider, List, Space, Typography } from 'antd';
import Link from 'next/link';
import useSWR from 'swr';

export function QuickContact() {
	const { data: friends, isLoading: friendsLoading } = useSWR<IPaginationResponse<UserType>>(
		`${userApi.endpoint.searchUser}/friends`,
		swrFetcher
	);
	const { data: suggests, isLoading: suggestsLoading } = useSWR<IPaginationResponse<UserType>>(
		`${userApi.endpoint.searchUser}/suggests`,
		swrFetcher
	);

	const lists = [
		{
			title: 'Liên hệ',
			data: friends?.items,
			loading: friendsLoading,
		},
		{
			title: 'Đề xuất',
			data: suggests?.items,
			loading: suggestsLoading,
		},
	];

	return (
		<Space direction="vertical">
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
					loading={list.loading}
					dataSource={list.data}
					renderItem={(item) => (
						<List.Item style={{ padding: '4px 0' }}>
							<Link href={`/profile?id=${item._id}`} draggable style={{ width: '100%' }}>
								<Button type="text" block style={{ height: 'auto', padding: '8px' }}>
									<Space align="center" style={{ width: '100%' }}>
										<UserAvatar user={item} avtSize={36} />

										<Typography.Text strong>{item.fullname}</Typography.Text>
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
