import { swrFetcher } from '@common/api';
import Layout from '@layout/components';
import { useAuth } from '@modules/auth/hooks';
import { ConversationType } from '@modules/messages/types';
import { getConversationInfo } from '@modules/messages/utils';
import { Button, Card, Space, Spin, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiPhone, HiVideoCamera } from 'react-icons/hi2';
import { TiInfoLarge } from 'react-icons/ti';
import useSWR from 'swr';
import { ConversationAvatar } from '../ConversationAvatar';
import { ConversationDetail } from '../ConversationDetail';
import { ConversationMessage } from './ConversationMessage';

export function ConversationContent() {
	const { authUser } = useAuth();
	const router = useRouter();

	const [detail, setDetail] = useState(false);
	const toggleDetail = () => setDetail((prev) => !prev);

	const id = router.query.id as string;
	const { isLoading, data } = useSWR<ConversationType>(`/conversations/${id}`, swrFetcher);

	if (isLoading)
		return (
			<Layout.Content>
				<Space style={{ width: '100%', height: '100%', justifyContent: 'center' }} align="center">
					<Spin />
				</Space>
			</Layout.Content>
		);

	if (!isLoading && !data)
		return (
			<Layout.Content>
				<Space style={{ width: '100%', height: '100%', justifyContent: 'center' }} align="center">
					<Typography.Text strong>Cuộc trò chuyện không tồn tại!</Typography.Text>
				</Space>
			</Layout.Content>
		);

	const conversation = data!;

	const { description, name } = getConversationInfo(conversation, authUser!);

	return (
		<>
			<Layout.Content style={{ maxWidth: '100%' }} fixed>
				<Card
					style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
					headStyle={{ padding: 8 }}
					title={
						<Space align="center" style={{ width: '100%' }}>
							<ConversationAvatar conversation={conversation} size={40} />

							<Space direction="vertical" size={0} style={{ width: '100%', flex: 1, overflow: 'hidden' }}>
								<Typography.Title level={5} style={{ margin: 0 }} ellipsis>
									{name}
								</Typography.Title>
								<Typography.Text type="secondary">{description}</Typography.Text>
							</Space>

							<Tooltip title="Gọi điện thoại">
								<Button shape="circle" icon={<HiPhone />} />
							</Tooltip>

							<Tooltip title="Gọi video">
								<Button shape="circle" icon={<HiVideoCamera />} />
							</Tooltip>

							<Tooltip title="Thông tin">
								<Button shape="circle" icon={<TiInfoLarge />} onClick={toggleDetail} />
							</Tooltip>
						</Space>
					}
					bodyStyle={{ padding: 8, overflow: 'hidden', flex: 1 }}
				>
					<ConversationMessage />
				</Card>
			</Layout.Content>

			<Layout.Sider align="right" collapse={!detail}>
				<ConversationDetail conversation={conversation} />
			</Layout.Sider>
		</>
	);
}
