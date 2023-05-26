import { WhiteBox } from '@components/Box';
import { IUser } from '@interfaces';
import { CenterArea } from '@layout';
import { useUserStore } from '@store';
import { List, Typography } from 'antd';
import { BlockProps } from 'antd/es/typography/Base';
import { toast } from 'react-hot-toast';
import { HiPencil } from 'react-icons/hi2';
import { ContactList } from '../lists';
import { EducationList } from '../lists/EducationList';
import { WorkList } from '../lists/WorkList';

interface Props {
	user: IUser;
}

export const InfoTab = ({ user }: Props) => {
	const { user: currentUser, updateProfile } = useUserStore();

	const isCurrentUser = currentUser?._id === user._id;

	if (isCurrentUser) user = currentUser; // Use current user data (for optimistic update)

	const getEditable = (field: keyof IUser): BlockProps['editable'] =>
		isCurrentUser && {
			icon: <HiPencil />,
			tooltip: 'Chỉnh sửa',
			onChange: handleChangeField(field),
			triggerType: ['icon', 'text'],
		};

	const handleChangeField = (field: keyof IUser) => (value: any) => {
		updateProfile({ [field]: value })
			.then(() => toast.success('Cập nhật thành công!'))
			.catch(() => toast.error('Cập nhật thất bại!'));
	};

	return (
		<CenterArea>
			<WhiteBox p={2}>
				<List header={<Typography.Title level={2}>Thông tin cá nhân</Typography.Title>}>
					<List.Item>
						<List.Item.Meta
							title={<Typography.Title level={4}>Họ và tên</Typography.Title>}
							description={
								<Typography.Text editable={getEditable('fullname')}>{user.fullname}</Typography.Text>
							}
						/>
					</List.Item>

					<List.Item>
						<List.Item.Meta
							title={<Typography.Title level={4}>Email</Typography.Title>}
							description={<Typography.Text>{user.email}</Typography.Text>}
						/>
					</List.Item>

					<List.Item>
						<List.Item.Meta
							title={<Typography.Title level={4}>Liên hệ</Typography.Title>}
							description={<ContactList contacts={user.contact} isCurrentUser={isCurrentUser} />}
						/>
					</List.Item>

					<List.Item>
						<List.Item.Meta
							title={<Typography.Title level={4}>Công việc</Typography.Title>}
							description={<WorkList works={user.work} isCurrentUser={isCurrentUser} />}
						/>
					</List.Item>

					<List.Item>
						<List.Item.Meta
							title={<Typography.Title level={4}>Học vấn</Typography.Title>}
							description={<EducationList educations={user.education} isCurrentUser={isCurrentUser} />}
						/>
					</List.Item>
				</List>
			</WhiteBox>
		</CenterArea>
	);
};
