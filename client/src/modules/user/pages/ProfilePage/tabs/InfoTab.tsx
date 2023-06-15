import { UserType } from '@modules/user/types';
import { Card, List, Typography } from 'antd';
import { toast } from 'react-hot-toast';
import { HiPencil } from 'react-icons/hi2';
import { ContactList, EducationList, WorkList } from '../lists';
import { useUserContext } from '@modules/user/hooks';
import { useAuth } from '@modules/auth/hooks';

export const InfoTab = () => {
	const { user, isCurrentUser } = useUserContext();
	const { updateAuthUser } = useAuth();

	const handleChangeField = (field: keyof UserType) => (value: any) => {
		if (value === user[field]) return; // No change

		updateAuthUser({ [field]: value })
			.then(() => toast.success('Cập nhật thành công!'))
			.catch(() => toast.error('Cập nhật thất bại!'));
	};

	return (
		<Card bodyStyle={{ padding: '1rem' }}>
			<List header={<Typography.Title level={2}>Thông tin cá nhân</Typography.Title>}>
				<List.Item>
					<List.Item.Meta
						title="Họ và tên"
						description={
							<Typography.Text
								editable={
									isCurrentUser && {
										icon: <HiPencil />,
										tooltip: 'Chỉnh sửa',
										onChange: handleChangeField('fullname'),
										triggerType: ['icon', 'text'],
									}
								}
							>
								{user.fullname}
							</Typography.Text>
						}
					/>
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Email" description={<Typography.Text>{user.email}</Typography.Text>} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Liên hệ" description={<ContactList />} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Công việc" description={<WorkList />} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Học vấn" description={<EducationList />} />
				</List.Item>
			</List>
		</Card>
	);
};
