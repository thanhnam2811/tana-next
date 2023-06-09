import { FetcherType, useFetcher } from '@common/hooks';
import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { Button, Card, Divider, Input, List, Space, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencilSquare } from 'react-icons/hi2';
import { createConversationApi } from '../api';
import { ConversationContent, ConversationListItem, CreateConversationModal } from '../components';
import { ConversationCreateType, ConversationType, MessageType } from '../types';
import SEO from '@common/components/SEO';
import { sortListConversation } from '@modules/messages/utils';

export const MessageContext = React.createContext<{
	// eslint-disable-next-line no-unused-vars
	updateConversation: (conv: any) => void;
	conversation: any;
	convFetcher: FetcherType<ConversationType>;
	fetching: boolean;
	isDirect: boolean;
} | null>(null);

function MessagesPage() {
	const convFetcher = useFetcher<ConversationType>({ api: 'conversations' });
	const listConv = convFetcher.data || [];

	const router = useRouter();
	const id = router.query.id as string;

	const [createModal, setCreateModal] = useState(false);
	const openCreateModal = () => setCreateModal(true);
	const closeCreateModal = () => setCreateModal(false);

	const createConversation = async (data: ConversationCreateType) => {
		const toastId = toast.loading('Đang tạo cuộc trò chuyện...');

		try {
			const conv = await createConversationApi(data);

			toast.success('Tạo cuộc trò chuyện thành công!', { id: toastId });

			convFetcher.addData(conv);

			// Chuyển đến trang chat
			await router.push({ pathname: '/messages', query: { id: conv._id } });

			closeCreateModal();
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}
	};

	useEffect(() => {
		if (id) {
			window.socket.on('sendMessage', (msg: MessageType) => {
				const conv = listConv?.find((conv) => conv._id === msg.conversation);
				if (conv) convFetcher.updateData(conv._id, { ...conv, lastest_message: msg });
			});
		}

		return () => {
			window.socket.off('sendMessage');
		};
	}, [id]);

	return (
		<>
			<SEO title="Tin nhắn" />

			<Layout.Sider align="left">
				<Card
					title={
						<Space direction="vertical" style={{ width: '100%', padding: 8 }}>
							<Space>
								<Typography.Title level={4} style={{ width: '100%' }}>
									Cuộc trò chuyện
								</Typography.Title>

								<CreateConversationModal
									open={createModal}
									onClose={closeCreateModal}
									onCreate={createConversation}
								/>

								<Tooltip title="Tạo cuộc trò chuyện">
									<Button shape="circle" icon={<HiPencilSquare />} onClick={openCreateModal} />
								</Tooltip>
							</Space>

							<Input.Search
								placeholder="Tìm kiếm cuộc trò chuyện"
								style={{ position: 'sticky', top: 0, zIndex: 1 }}
							/>
						</Space>
					}
					style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
					headStyle={{ padding: '8px 0' }}
					bodyStyle={{ padding: 8, height: '100%', overflow: 'hidden auto' }}
				>
					<List
						style={{ marginTop: 8 }}
						dataSource={sortListConversation(listConv)}
						loading={convFetcher.fetching}
						renderItem={(item) => <ConversationListItem conversation={item} key={item._id} />}
					/>
				</Card>
			</Layout.Sider>

			{id ? (
				<ConversationContent onUpdate={convFetcher.updateData} />
			) : (
				<Layout.Content>
					<Space style={{ width: '100%', height: '100%', justifyContent: 'center' }} align="center">
						<Space direction="vertical" align="center">
							<Typography.Text strong>Chọn một cuộc trò chuyện để bắt đầu</Typography.Text>

							<Divider style={{ margin: 0 }}>
								<Typography.Text type="secondary">Hoặc</Typography.Text>
							</Divider>

							<Button
								type="primary"
								onClick={openCreateModal}
								icon={<HiPencilSquare />}
								style={{ width: 'fit-content' }}
							>
								Tạo mới
							</Button>
						</Space>
					</Space>
				</Layout.Content>
			)}
		</>
	);
}

export default withAuth(withLayout(MessagesPage));
