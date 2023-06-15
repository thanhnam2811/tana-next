import { useAuth } from '@modules/auth/hooks';
import { useConversationContext } from '@modules/messages/hooks';
import { UserAvatar } from '@modules/user/components';
import { Button, List, Space, Tag, Typography } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MemberDropdown } from '../../MemberDropdown';

export function MemberMenu() {
	const { conversation, updateConversation } = useConversationContext()!;
	const { authUser } = useAuth();

	return (
		<List
			dataSource={conversation.members}
			renderItem={(member) => (
				<List.Item
					extra={
						<MemberDropdown conversation={conversation} member={member} onUpdateMember={updateConversation}>
							<Button shape="circle" size="small" icon={<HiDotsHorizontal />} />
						</MemberDropdown>
					}
				>
					<List.Item.Meta
						avatar={<UserAvatar user={member.user} avtSize={24} />}
						title={
							<Space>
								<Typography.Text strong>{member.nickname || member.user.fullname}</Typography.Text>

								{member.user._id === authUser!._id && <Tag>Bạn</Tag>}
							</Space>
						}
						description={
							<Typography.Text style={{ fontSize: 12 }} ellipsis>
								{member.role === 'admin' ? (
									'Quản trị viên'
								) : (
									<>
										Được <strong>{member.addedBy.fullname}</strong> thêm vào
									</>
								)}
							</Typography.Text>
						}
					/>
				</List.Item>
			)}
		/>
	);
}
