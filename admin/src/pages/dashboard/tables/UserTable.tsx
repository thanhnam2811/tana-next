import { userApi } from '@/api';
import { TableBase } from '@/component/Table';
import { IPicture, IUser } from '@/interface';
import { Avatar, Button } from 'antd';
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

	const viewAll = () => {
		navigate('/account/user');
	};

	return (
		<TableBase<IUser>
			cardProps={{
				title: 'Người dùng mới',
				extra: <Button onClick={viewAll}>Xem tất cả</Button>,
			}}
			endpoint={userApi.endpoint.searchUser}
			columns={columns}
			pagination={{ position: [] }} // hide pagination
			// onRow={(user) => ({
			// 	style: { cursor: 'pointer' },
			// 	onClick: () => navigate(`/account/user/${user._id}`),
			// })}
		/>
	);
}
