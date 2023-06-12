import { useAuth } from '@modules/auth/hooks';
import { ConversationType } from '@modules/messages/types';
import { getConversationInfo } from '@modules/messages/utils';
import { Badge, Button, Card, Collapse, Space, Tooltip, Typography } from 'antd';
import { HiLogout } from 'react-icons/hi';
import {
	HiBellSnooze,
	HiCamera,
	HiDocument,
	HiExclamationTriangle,
	HiPhoto,
	HiUserPlus,
	HiUsers,
} from 'react-icons/hi2';
import { ConversationAvatar } from '../ConversationAvatar';
import { UserAvatar } from '@modules/user/components';
import { TiInfoLarge } from 'react-icons/ti';

interface Props {
	conversation: ConversationType;
}

export function ConversationDetail({ conversation }: Props) {
	const { authUser } = useAuth();
	const { isDirect, name, description } = getConversationInfo(conversation, authUser!);

	return (
		<Card>
			<Space direction="vertical" size={16} align="center">
				<Badge count={<Button shape="circle" icon={<HiCamera />} />}>
					<ConversationAvatar conversation={conversation} size={128} />
				</Badge>

				<Typography.Title level={4} ellipsis editable={{ triggerType: ['icon', 'text'] }}>
					{name}
				</Typography.Title>

				<Typography.Text type="secondary">{description}</Typography.Text>

				<Space direction="vertical" size={8} split>
					{isDirect ? (
						<Tooltip title="Tạo nhóm">
							<Button shape="circle" icon={<HiUserPlus />} />
						</Tooltip>
					) : (
						<Tooltip title="Rời nhóm">
							<Button shape="circle" icon={<HiLogout />} />
						</Tooltip>
					)}

					<Tooltip title="Tắt thông báo">
						<Button shape="circle" icon={<HiBellSnooze />} />
					</Tooltip>

					<Tooltip title="Báo cáo">
						<Button shape="circle" icon={<HiExclamationTriangle />} />
					</Tooltip>
				</Space>

				<Collapse>
					<Collapse.Panel
						header={
							<Space>
								<TiInfoLarge />

								<Typography.Text strong>Thông tin</Typography.Text>
							</Space>
						}
						key="info"
					>
						<Space direction="vertical" size={16} style={{ width: '100%' }}>
							<Button block>Đổi chủ đề</Button>
						</Space>
					</Collapse.Panel>

					<Collapse.Panel
						header={
							<Space>
								<HiUsers />

								<Typography.Text strong>Thành viên</Typography.Text>
							</Space>
						}
						key="members"
					>
						<Space direction="vertical" size={16} style={{ width: '100%' }}>
							<Button block>Thêm thành viên</Button>

							{conversation.members.map(({ user, nickname }) => (
								<Space key={user._id} align="center">
									<UserAvatar user={user} size={32} />

									<Typography.Text ellipsis strong>
										{nickname || user.fullname}
									</Typography.Text>
								</Space>
							))}
						</Space>
					</Collapse.Panel>

					<Collapse.Panel
						header={
							<Space>
								<HiPhoto />

								<Typography.Text strong>Hình ảnh & Video</Typography.Text>
							</Space>
						}
						key="media"
					>
						<Space direction="vertical" size={16} style={{ width: '100%' }}>
							Hình ảnh & Video
						</Space>
					</Collapse.Panel>

					<Collapse.Panel
						header={
							<Space>
								<HiDocument />

								<Typography.Text strong>Tệp</Typography.Text>
							</Space>
						}
						key="files"
					>
						<Space direction="vertical" size={16} style={{ width: '100%' }}>
							Tệp
						</Space>
					</Collapse.Panel>
				</Collapse>
			</Space>
		</Card>
	);
}
