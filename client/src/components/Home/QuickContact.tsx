import { UserCard } from '@components/v2/Card/UserCard';
import { IPaginationResponse, UserType } from '@interfaces';
import { swrFetcher, userApi } from '@utils/api';
import { List, Typography } from 'antd';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export function QuickContact() {
	const router = useRouter();
	const { data: friends, isLoading: friendsLoading } = useSWR<IPaginationResponse<UserType>>(
		`${userApi.endpoint.searchUser}/friends`,
		swrFetcher
	);
	const { data: suggests, isLoading: suggestsLoading } = useSWR<IPaginationResponse<UserType>>(
		`${userApi.endpoint.searchUser}/suggests`,
		swrFetcher
	);

	return (
		<>
			<List
				header={<Typography.Title level={4}>Liên hệ</Typography.Title>}
				dataSource={friends?.items}
				renderItem={(item) => (
					<List.Item onClick={() => router.push(`/profile?id=${item._id}`)}>
						<UserCard.Simple user={item} />
					</List.Item>
				)}
				loading={friendsLoading}
			/>

			<List
				header={<Typography.Title level={4}>Đề xuất</Typography.Title>}
				dataSource={suggests?.items}
				renderItem={(item) => (
					<List.Item onClick={() => router.push(`/profile?id=${item._id}`)}>
						<UserCard.Simple user={item} />
					</List.Item>
				)}
				loading={suggestsLoading}
			/>
		</>
	);
}
