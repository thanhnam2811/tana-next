import { UserAvatar } from '@components/v2/Avatar';
import { IPaginationResponse, UserType } from '@interfaces';
import { swrFetcher, userApi } from '@utils/api';
import { Button, Card, List, Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

interface ContactItemProps {
	user: UserType;
}

const ContactItem = ({ user }: ContactItemProps) => (
	<Button type="text" style={{ width: '100%', height: 'auto' }}>
		<Space align="center" style={{ width: '100%' }}>
			<UserAvatar user={user!} />

			<Typography.Title level={5} style={{ margin: 0 }}>
				{user!.fullname}
			</Typography.Title>
		</Space>
	</Button>
);

export function QuickContact() {
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
					<List.Item>
						<Link href={`/profile?id=${item._id}`} style={{ width: '100%' }}>
							<ContactItem user={item} />
						</Link>
					</List.Item>
				)}
				loading={friendsLoading}
			/>

			<List
				header={<Typography.Title level={4}>Đề xuất</Typography.Title>}
				dataSource={suggests?.items}
				renderItem={(item) => (
					<List.Item>
						<Link href={`/profile?id=${item._id}`}>
							<ContactItem user={item} />
						</Link>
					</List.Item>
				)}
				loading={suggestsLoading}
			/>
		</>
	);
}
