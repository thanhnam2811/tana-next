import { userApi } from '@/api';
import { BaseTable } from '@/component/Table';
import { IPaginationParams, IPicture, IUser } from '@/interface';
import { Avatar, Button, Card } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const columns: ColumnType<IUser>[] = [
	{
		key: 'avatar',
		title: 'Avatar',
		dataIndex: 'profilePicture',
		render: (profilePicture: IPicture, user) => (
			<Avatar src={profilePicture.link} alt="avatar">
				{user.fullname}
			</Avatar>
		),
	},
	{
		key: 'fullname',
		title: 'Tên',
		dataIndex: 'fullname',
	},
	{
		key: 'email',
		title: 'Email',
		dataIndex: 'email',
	},
];

export function UserTable() {
	const navigate = useNavigate();

	const fetchData = async ({ page, size }: IPaginationParams) => {
		const { data } = await userApi.get({ params: { page, size } });
		return data;
	};

	const viewAll = () => {
		navigate('/account/user');
	};

	return (
		<Card title="Người dùng mới" extra={<Button onClick={viewAll}>Xem tất cả</Button>}>
			<BaseTable<IUser>
				fetchData={fetchData}
				columns={columns}
				pagination={{ position: [] }} // hide pagination
				onRow={(user) => ({
					style: { cursor: 'pointer' },
					onClick: () => navigate(`/account/user/${user._id}`),
				})}
			/>
		</Card>
	);
}
