import { useFetcher } from '@common/hooks';
import { UserType } from '@modules/user/types';
import { Button, Card, Form, Input, List, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { FriendCard } from '../components';
import { friendTypeList } from '../data';
import { FriendType, IFriendFilter, RelationshipType } from '../types';

interface Props {
	type: FriendType;
}

export function ListFriend({ type }: Props) {
	const [filter, setFilter] = useState<IFriendFilter>({ sort: 'desc', gender: '' });
	const friendFetcher = useFetcher<UserType>({ api: `/users/searchUser/${type}`, params: filter, limit: 12 });

	const typingRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			setFilter({ ...filter, key: value });
		}, 300);
	};

	return (
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
					renderItem={(user) => {
						const handleUpdateRelationship = (relationship: RelationshipType) =>
							friendFetcher.updateData(user._id, { ...user, relationship });
						return (
							<List.Item>
								<FriendCard user={user} onUpdateRelationship={handleUpdateRelationship} />
							</List.Item>
						);
					}}
				/>
			</Space>
		</Card>
	);
}
