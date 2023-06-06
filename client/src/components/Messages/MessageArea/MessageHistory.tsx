import { GroupAvatar, MyIconButton } from '@components/MUI';
import { FetcherType } from '@common/hooks';
import { MessageType } from '@common/types';
import { Avatar, Box, CircularProgress, Slide, Stack, Typography } from '@mui/material';
import { MessageContext } from '@pages/messages/[id]';
import { useAuth } from '@modules/auth/hooks';
import { stringUtil } from '@utils/common';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageItem } from './MessageItem';

interface Props {
	// eslint-disable-next-line no-unused-vars
	onMediaPreview: (media: any) => void;
	fetcher: FetcherType<MessageType>;
}

export const MessagesHistory = ({ onMediaPreview, fetcher }: Props) => {
	const { conversation } = useContext(MessageContext)!;

	const { authUser } = useAuth();
	const listMember = conversation?.members || [];
	const listMessage = fetcher.data;

	// scroll to bottom button
	const bottomRef = useRef<HTMLElement>(null);
	const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

	const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);
	const handleScroll = (e: any) => {
		const { scrollTop } = e.target;
		const isShowScrollToBottom = scrollTop < -200;
		setShowScrollToBottom(isShowScrollToBottom);
	};

	// listen scroll event to show scroll to bottom button
	useEffect(() => {
		const element = document.getElementById('messages-history');
		element?.addEventListener('scroll', handleScroll);
		return () => {
			element?.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<Box
			id="messages-history"
			overflow="auto"
			height="100%"
			maxHeight="100%"
			display="flex"
			flexDirection="column-reverse"
		>
			<Slide direction="up" in={showScrollToBottom} mountOnEnter unmountOnExit>
				<Box
					position="absolute"
					m="auto"
					left={0}
					right={0}
					bottom={0}
					display="flex"
					justifyContent="center"
					zIndex={1}
				>
					<MyIconButton onClick={scrollToBottom} tooltip="Mới nhất" variant="color" Icon={FaArrowDown} />
				</Box>
			</Slide>

			<InfiniteScroll
				scrollableTarget="messages-history"
				dataLength={listMessage.length}
				style={{ display: 'flex', flexDirection: 'column-reverse' }}
				next={fetcher.loadMore}
				hasMore={fetcher.hasMore}
				inverse={true}
				loader={
					<Box key="loader" display="flex" justifyContent="center" m={2}>
						<CircularProgress />
					</Box>
				}
				endMessage={
					<Box key="end-message" display="flex" justifyContent="center" m={2}>
						<UserPreview listMember={listMember} conversation={conversation} />
					</Box>
				}
			>
				{/* bottom ref */}
				{listMessage.length > 0 && <Box ref={bottomRef} />}

				{listMessage.map(({ _id, isSystem, text, sender, sending, media, error }: any, index: number) => (
					<MessageItem
						key={_id}
						isSystem={isSystem}
						other={sender?._id !== authUser?._id}
						text={text}
						combine={{
							prev: listMessage[index - 1]?.sender?._id === sender?._id,
							next: listMessage[index + 1]?.sender?._id === sender?._id,
						}}
						sender={listMember.find((member: any) => member.user?._id === sender?._id)}
						sending={sending}
						media={media}
						error={error}
						onMediaPreview={onMediaPreview}
					/>
				))}
			</InfiniteScroll>
		</Box>
	);
};

const UserPreview = ({ listMember, conversation }: any) => {
	const { authUser } = useAuth();

	const isDirect = listMember.length === 2;
	const user = isDirect && listMember.filter((m: any) => m?.user?._id !== authUser?._id)[0]?.user;

	return (
		<Stack direction="column" alignItems="center" spacing={1}>
			{/* Avatar */}
			{isDirect ? (
				<Avatar src={user?.profilePicture?.link} alt={user?.fullname} style={{ width: 80, height: 80 }}>
					{stringUtil.getShortName(user?.fullname)}
				</Avatar>
			) : conversation?.avatar?.link ? (
				<Avatar src={conversation?.avatar?.link} alt={conversation?.name} style={{ width: 80, height: 80 }} />
			) : (
				<GroupAvatar listMember={listMember} />
			)}

			{/* Name */}
			<Box ml={1} textAlign="center">
				<Typography fontSize={20} fontWeight={800}>
					{isDirect ? user?.fullname : conversation.name}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{isDirect ? user?.email : `Đã tham gia ${listMember.length} thành viên`}
				</Typography>
			</Box>
		</Stack>
	);
};
