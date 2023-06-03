import { WhiteBox } from '@components/Box';
import { UserType } from '@interfaces';
import { useAuth } from '@modules/auth/hooks';
import { List, Typography } from 'antd';
import { toast } from 'react-hot-toast';
import { HiPencil } from 'react-icons/hi2';
import { ContactList } from '../lists';
import { EducationList } from '../lists/EducationList';
import { WorkList } from '../lists/WorkList';

interface Props {
	user: UserType;
}

export const InfoTab = ({ user }: Props) => {
	const { authUser, updateAuthUser } = useAuth();

	const isCurrentUser = authUser?._id === user._id;

	if (isCurrentUser) user = authUser; // Use current user data (for optimistic update)

	const handleChangeField = (field: keyof UserType) => (value: any) => {
		if (value === user[field]) return; // No change

		updateAuthUser({ [field]: value })
			.then(() => toast.success('Cập nhật thành công!'))
			.catch(() => toast.error('Cập nhật thất bại!'));
	};

	return (
		<WhiteBox p={2}>
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
					<List.Item.Meta
						title="Liên hệ"
						description={<ContactList contacts={user.contact} isCurrentUser={isCurrentUser} />}
					/>
				</List.Item>

				<List.Item>
					<List.Item.Meta
						title="Công việc"
						description={<WorkList works={user.work} isCurrentUser={isCurrentUser} />}
					/>
				</List.Item>

				<List.Item>
					<List.Item.Meta
						title="Học vấn"
						description={<EducationList educations={user.education} isCurrentUser={isCurrentUser} />}
					/>
				</List.Item>
			</List>
		</WhiteBox>
	);
};
