import { IPicture, UserType } from '@common/types/user.type';
import { PageTableBase } from '@components/PageTableBase';
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

export default function UserPage() {
	return <PageTableBase<UserType> header="Người dùng" endpoint="/admin/searchUser" columns={columns} />;
}
