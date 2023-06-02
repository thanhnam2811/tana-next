import { PageTableBase } from '@/component/PageTableBase';
import { IPicture, UserType } from '@/types/user.type';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';

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

export default function AdminPage() {
	return <PageTableBase<UserType> header="Người dùng" endpoint="/admin/searchAdmin" columns={columns} />;
}
