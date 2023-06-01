import { TableBase } from '@/component/Table';
import { IPicture, UserType } from '@/types/user.type';
import { Avatar, Button, Card } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const columns: ColumnType<UserType>[] = [
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

export default function UserTable() {
	const navigate = useNavigate();

	const viewAll = () => {
		navigate('/account/user');
	};

	return (
		<Card title="Người dùng mới" extra={<Button onClick={viewAll}>Xem tất cả</Button>}>
			<TableBase<UserType>
				endpoint="/admin/searchUser"
				columns={columns}
				pagination={{ position: [] }} // hide pagination
				// onRow={(user) => ({
				// 	style: { cursor: 'pointer' },
				// 	onClick: () => navigate(`/account/user/${user._id}`),
				// })}
			/>
		</Card>
	);
}
