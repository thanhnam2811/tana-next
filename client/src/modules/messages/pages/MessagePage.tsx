import { FetcherType, useFetcher } from '@common/hooks';
import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { Button, Card, Input, List, Space, Tooltip, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { HiPlus } from 'react-icons/hi2';
import { ConversationListItem } from '../components';
import { ConversationType } from '../types';

export const MessageContext = React.createContext<{
	// eslint-disable-next-line no-unused-vars
	updateConversation: (conv: any) => void;
	conversation: any;
	convFetcher: FetcherType<ConversationType>;
	fetching: boolean;
	isDirect: boolean;
} | null>(null);

function MessagesPage() {
	const router = useRouter();
	const id = router.query.id as string;
	const all = !id || id === 'all';

	const convFetcher = useFetcher<ConversationType>({ api: 'conversations' });

	return (
		<>
			<Layout.Sider align="left">
				<Card
					title={
						<Space direction="vertical" style={{ width: '100%', padding: 8 }}>
							<Space>
								<Typography.Title level={4} style={{ width: '100%' }}>
									Cuộc trò chuyện
								</Typography.Title>

								<Tooltip title="Tạo cuộc trò chuyện">
									<Button shape="circle" icon={<HiPlus />} />
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
						dataSource={convFetcher.data}
						loading={convFetcher.fetching}
						renderItem={(item) => <ConversationListItem conversation={item} key={item._id} />}
					/>
				</Card>
			</Layout.Sider>

			<Layout.Content>
				{all ? (
					<Space style={{ width: '100%', height: '100%', justifyContent: 'center' }} align="center">
						<Typography.Title level={4}>Chọn một cuộc trò chuyện để bắt đầu</Typography.Title>
					</Space>
				) : (
					<Typography.Title level={4}>Cuộc trò chuyện: {id}</Typography.Title>
				)}
			</Layout.Content>
		</>
	);
}

export default withAuth(withLayout(MessagesPage));
