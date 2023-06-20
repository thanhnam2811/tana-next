import { useFetcher } from '@common/hooks';
import { UserType } from '@modules/user/types';
import { Button, Card, Form, Input, List, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { FriendCard } from '../components';
import { IFriendFilter, RelationshipType } from '../types';

interface Props {
	api: string;
	title?: string;
}

export function ListFriend({ api, title = 'Danh sách bạn bè' }: Props) {
	const [filter, setFilter] = useState<IFriendFilter>({ sort: 'desc', gender: '' });
	const friendFetcher = useFetcher<UserType>({ api, params: filter, limit: 12 });

	const typingRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			setFilter({ ...filter, key: value });
		}, 300);
	};

	return (
		<Card title={title} headStyle={{ padding: '0 16px' }} bodyStyle={{ padding: 8 }}>
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
					renderItem={(user) => (
						<List.Item>
							<FriendCard user={user} />
						</List.Item>
					)}
				/>
			</Space>
		</Card>
	);
}
