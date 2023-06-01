import { PageTableBase } from '@/component';
import { IPicture, IUser } from '@/interface';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';

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

export function UserPage() {
	return <PageTableBase<IUser> header="Người dùng" endpoint="/admin/searchUser" columns={columns} />;
}
