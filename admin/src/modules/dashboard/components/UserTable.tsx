import { TableBase } from '@common/components/Table';
import { Avatar, Button, Card } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { IMedia } from '@common/types';
import { UserType } from '@modules/user/types';

const columns: ColumnType<UserType>[] = [
	{
		key: 'avatar',
		title: 'Avatar',
		dataIndex: 'profilePicture',
		render: (profilePicture: IMedia, user) => (
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

	const viewAll = () => {
		navigate('/account/user');
	};

	return (
		<Card title="Người dùng mới" extra={<Button onClick={viewAll}>Xem tất cả</Button>} bodyStyle={{ padding: 12 }}>
			<TableBase<UserType>
				endpoint="/admin/searchUser"
				columns={columns}
				pagination={{ position: [] }} // hide pagination
			/>
		</Card>
	);
}
