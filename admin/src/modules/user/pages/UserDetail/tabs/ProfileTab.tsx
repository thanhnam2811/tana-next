import { UserType } from '@modules/user/types';
import { Descriptions, Space } from 'antd';
import { capitalize } from 'lodash';
import { timeUtil } from '@common/utils';
import UserStatusTag from '@modules/user/components/UserStatusTag.tsx';

interface Props {
	user: UserType;
}

function ProfileTab({ user }: Props) {
	return (
		<Descriptions>
			<Descriptions.Item label="Tên">{user.fullname}</Descriptions.Item>
			<Descriptions.Item label="Email">{user.email}</Descriptions.Item>
			<Descriptions.Item label="Giới tính">{capitalize(user.gender?.label)}</Descriptions.Item>

			<Descriptions.Item label="Trạng thái">
				<UserStatusTag user={user} />
			</Descriptions.Item>
			<Descriptions.Item label="Ngày tạo">{timeUtil.formatDate(user.createdAt)}</Descriptions.Item>
			<Descriptions.Item label="Ngày cập nhật">{timeUtil.formatDate(user.updatedAt)}</Descriptions.Item>

			<Descriptions.Item label="Liên hệ">
				<Space direction="vertical">{user.contact.map((contact) => contact.value)}</Space>
			</Descriptions.Item>
			<Descriptions.Item label="Học vấn">
				<Space direction="vertical">{user.education.map((edu) => edu.school)}</Space>
			</Descriptions.Item>
			<Descriptions.Item label="Công việc">
				<Space direction="vertical">{user.work.map((work) => work.company)}</Space>
			</Descriptions.Item>
		</Descriptions>
	);
}

export default ProfileTab;
