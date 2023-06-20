import { PageTableBase } from '@common/components/PageTableBase';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';
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

export default function AdminPage() {
	return <PageTableBase<UserType> header="Người dùng" endpoint="/admin/searchAdmin" columns={columns} />;
}
