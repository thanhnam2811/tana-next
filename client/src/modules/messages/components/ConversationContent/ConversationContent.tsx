import { swrFetcher } from '@common/api';
import Layout from '@layout/components';
import { useAuth } from '@modules/auth/hooks';
import { ConversationFormType, ConversationType } from '@modules/messages/types';
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
import { toast } from 'react-hot-toast';
import { updateConversationApi } from '@modules/messages/api';
import { ConversationProvider } from '@modules/messages/hooks';
import Head from 'next/head';

interface Props {
	onUpdate?: (id: string, data: ConversationType) => void;
}

export function ConversationContent({ onUpdate }: Props) {
	const { authUser } = useAuth();
	const router = useRouter();

	const [detail, setDetail] = useState(false);
	const toggleDetail = () => setDetail((prev) => !prev);

	const id = router.query.id as string;
	const { isLoading, data, mutate } = useSWR<ConversationType>(`/conversations/${id}`, swrFetcher);

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

	const updateConversation = (data: ConversationType) => {
		onUpdate?.(id, data);
		return mutate(data);
	};

	const updateConversationForm = async (data: ConversationFormType) => {
		const toastId = toast.loading('Đang cập nhật cuộc trò chuyện...');

		try {
			const conv = await updateConversationApi(id, data);
			updateConversation(conv);

			toast.success('Cập nhật cuộc trò chuyện thành công!', { id: toastId });
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	return (
		<ConversationProvider
			value={{
				conversation,
				updateConversation,
				updateConversationForm,
			}}
		>
			<Head>
				<title>{name} - Tin nhắn</title>
			</Head>

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
				<ConversationDetail />
			</Layout.Sider>
		</ConversationProvider>
	);
}
