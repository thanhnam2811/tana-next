import { withAuth } from '@components/Auth';
import { WhiteBox } from '@components/Box';
import { ListConversation } from '@components/List';
import { MyIconButton, SearchInput } from '@components/MUI';
import { DetailArea, MessageArea } from '@components/Messages';
import { ConversationModal, MediaViewModal } from '@components/Modal';
import { InfinitFetcherType, useInfiniteFetcher } from '@hooks';
import { CenterArea, ContainerArea, LeftArea, RightArea } from '@layout';
import { Badge, Box, Stack, Typography } from '@mui/material';
import { useSettingStore } from '@store';
import { conversationApi } from '@utils/api';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { TbEdit } from 'react-icons/tb';

export const MessageContext = React.createContext<{
	// eslint-disable-next-line no-unused-vars
	updateConversation: (conv: any) => void;
	conversation: any;
	convFetcher: InfinitFetcherType;
	fetching: boolean;
	isDirect: boolean;
} | null>(null);

function MessagesPage() {
	const router = useRouter();
	const { id } = router.query;
	const all = !id || id === 'all';

	const convFetcher = useInfiniteFetcher('conversations');
	const handleSearch = (value: string) => convFetcher.filter({ key: value }); // TODO: change to search

	const [conversation, setConversation] = useState<any>(null);
	const isDirect = conversation?.members?.length === 2;
	const [fetching, setFetching] = useState(false);

	const createConversation = async (listMember: any) => {
		try {
			// call api
			const data = {
				members: listMember.map((m: any) => ({ user: m._id })),
				name: listMember.map((m: any) => m.fullname).join(', '),
			};
			const res = await conversationApi.create(data);
			const newConv = res.data;

			// alert success
			toast.success('Tạo cuộc trò chuyện thành công!');

			// update data
			convFetcher.addData(newConv);

			// go to new conversation
			router.push(`/messages/${newConv._id}`);
		} catch (error: any) {
			toast.error(error?.message || error);
		}
	};

	const updateConversation = (newConv: any) => {
		convFetcher.updateData(newConv._id, newConv); // update data in list
		setConversation(newConv); // update data in detail
	};

	// fetch data when page load
	useEffect(() => {
		convFetcher.reload();
	}, []);

	// set conversation when change ID
	const idRef = useRef(id);
	useEffect(() => {
		idRef.current = id;
		const fetchConversation = async () => {
			setFetching(true);
			try {
				// get conversation
				const res = await conversationApi.get(id as string);
				const conversation = res.data;

				// set conversation if id is not changed
				if (conversation._id === idRef.current) setConversation(conversation);
			} catch (error: any) {
				// if error, toast error and go to all conversation
				toast.error(error?.message || error);
				router.replace('/messages');
			}
			setFetching(false);
		};

		if (!all) {
			fetchConversation();
			window.socket.emit('joinRoom', id);
		}

		return () => {
			if (id) window.socket.emit('leaveRoom', id);
		};
	}, [id]);

	const {
		setting: {
			message: { showDetail },
		},
	} = useSettingStore();

	const [mediaPreview, setMediaPreview] = useState<any>();
	const openMediaPreview = Boolean(mediaPreview);
	const handleMediaPreview = (image: any) => setMediaPreview(image);
	const handleCloseMediaPreview = () => setMediaPreview(null);

	const [openModalCreate, setOpenModalCreate] = useState(false);
	const handleOpenModalCreate = () => setOpenModalCreate(true);
	const handleCloseModalCreate = () => setOpenModalCreate(false);

	return (
		<ContainerArea>
			{id && id !== 'all' && (
				<MediaViewModal open={openMediaPreview} onClose={handleCloseMediaPreview} mediaData={mediaPreview} />
			)}

			<LeftArea fixed>
				<WhiteBox
					sx={{
						py: '8px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{/* Conversation header */}
					<Stack alignItems="stretch" px={2} gap={1} py={1}>
						{/* Title Area */}
						<Stack direction="row">
							{/* Title */}
							<Badge badgeContent={10} color="error">
								<Typography variant="h5" fontWeight={700}>
									Tin nhắn
								</Typography>
							</Badge>
							{/* Icon */}
							<MyIconButton
								Icon={TbEdit}
								size={20}
								tooltip={'Tin nhắn mới'}
								onClick={handleOpenModalCreate}
								sx={{ p: 0, ml: 'auto' }}
							/>
							<ConversationModal
								open={openModalCreate}
								handleClose={handleCloseModalCreate}
								handleSubmit={createConversation}
							/>
						</Stack>

						{/* Search bar */}
						<SearchInput placeholder="Tìm kiếm cuộc trò chuyện" onSearch={handleSearch} />
						{/* Divider */}
					</Stack>

					{/* Conversation list */}
					<Box overflow={'hidden auto'} flex={1} id="list-conversation" p={2}>
						<ListConversation fetcher={convFetcher} scrollableTarget="list-conversation" />
					</Box>
				</WhiteBox>
			</LeftArea>

			{!all && conversation ? (
				<MessageContext.Provider
					value={{
						conversation,
						convFetcher,
						fetching,
						isDirect,
						updateConversation,
					}}
				>
					<CenterArea width="100%">
						<MessageArea onMediaPreview={handleMediaPreview} />
					</CenterArea>

					{showDetail && (
						<RightArea fixed>
							<DetailArea />
						</RightArea>
					)}
				</MessageContext.Provider>
			) : (
				<Box flex={1} display="flex" justifyContent="center" alignItems="center">
					Chọn cuộc trò chuyện để xem tin nhắn
				</Box>
			)}
		</ContainerArea>
	);
}

export default withAuth(MessagesPage);
