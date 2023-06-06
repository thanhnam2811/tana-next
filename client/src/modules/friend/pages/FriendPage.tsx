import { useFetcher } from '@common/hooks';
import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { UserType } from '@modules/user/types';
import { Button, Card, Form, Input, List, Menu, Select, Space } from 'antd';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { FriendCard } from '../components';
import { friendTypeList } from '../data';
import { FriendType, IFriendFilter } from '../types';

function FriendPage() {
	const router = useRouter();
	const type = (router.query.type as FriendType) || 'friends';

	const [filter, setFilter] = useState<IFriendFilter>({ sort: 'desc', gender: '' });
	const friendFetcher = useFetcher<UserType>({ api: `/users/searchUser/${type}`, params: filter });

	const changeType = (type: FriendType) => router.push({ pathname: router.pathname, query: { type } });

	const typingRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			setFilter({ ...filter, key: value });
		}, 300);
	};

	return (
		<>
			<Layout.Sider align="left">
				<Card title="Danh sách" headStyle={{ padding: '0 16px' }} bodyStyle={{ padding: '0 8px' }}>
					<Menu
						mode="vertical"
						style={{ width: '100%', border: 'none' }}
						items={friendTypeList.map((item) => ({
							key: item.type,
							icon: <item.Icon size={20} />,
							label: item.title,
						}))}
						selectedKeys={[type]}
						onClick={({ key }) => changeType(key as FriendType)}
					/>
				</Card>
			</Layout.Sider>

			<Layout.Content>
				<Card
					title={friendTypeList.find((item) => item.type === type)?.title}
					headStyle={{ padding: '0 16px' }}
					bodyStyle={{ padding: 8 }}
				>
					<Space direction="vertical" style={{ width: '100%' }}>
						<Input.Search placeholder="Tìm kiếm bạn bè" onChange={handleSearch} />

						<Form
							layout="inline"
							style={{ float: 'right' }}
							size="small"
							initialValues={{ sort: 'desc', gender: '' }}
							onValuesChange={(_, values) => setFilter({ ...filter, ...values })}
						>
							<Form.Item label="Sắp xếp" name="sort">
								<Select
									options={[
										{ label: 'Mới nhất', value: 'desc' },
										{ label: 'Cũ nhất', value: 'asc' },
									]}
									showSearch={false}
									style={{ width: 120 }}
								/>
							</Form.Item>

							<Form.Item label="Giới tính" name="gender">
								<Select
									options={[
										{ label: 'Tất cả', value: '' },
										{ label: 'Nam', value: 'male' },
										{ label: 'Nữ', value: 'female' },
										{ label: 'Khác', value: 'other' },
									]}
									showSearch={false}
									style={{ width: 120 }}
								/>
							</Form.Item>
						</Form>

						<List
							itemLayout="horizontal"
							dataSource={friendFetcher.data}
							loading={friendFetcher.fetching}
							loadMore={
								!friendFetcher.fetching &&
								friendFetcher.hasMore && (
									<Button type="primary" onClick={friendFetcher.loadMore}>
										Xem thêm
									</Button>
								)
							}
							grid={{ gutter: 16, column: 3 }}
							renderItem={(item) => (
								<List.Item>
									<FriendCard user={item} />
								</List.Item>
							)}
						/>
					</Space>
				</Card>
			</Layout.Content>
		</>
	);
}

export default withAuth(withLayout(FriendPage));
