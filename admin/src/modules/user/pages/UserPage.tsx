import { PageTableBase } from '@common/components/PageTableBase';
import { Avatar } from 'antd';
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

export default function UserPage() {
	const navigate = useNavigate();

	return (
		<PageTableBase<UserType>
			header="Người dùng"
			endpoint="/admin/searchUser"
			columns={columns}
			onRow={(record) => {
				return {
					style: { cursor: 'pointer' },
					onClick: () => navigate(`/account/user/${record._id}`),
				};
			}}
		/>
	);
}
