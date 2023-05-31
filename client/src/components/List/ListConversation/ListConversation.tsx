import { InfinitFetcherType } from '@hooks';
import { Collapse, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup } from 'react-transition-group';
import { ConversationItem, ConversationItemSkeleton } from './ConversationItem';
import { ConversationType } from '@interfaces';

const loader = [...Array(10)].map((_v, index) => <ConversationItemSkeleton key={index} />);

interface Props {
	fetcher: InfinitFetcherType<ConversationType>;
	scrollableTarget: string;
}

export function ListConversation({ fetcher, scrollableTarget }: Props) {
	const listConversation = fetcher.data;

	const router = useRouter();
	const { id } = router.query;

	// const [anchorEl, setAnchorEl] = useState<any>();
	// const open = Boolean(anchorEl);
	// const openMenu = (event: any) => setAnchorEl(event.target);
	// const closeMenu = () => setAnchorEl(null);

	// const menuOptions = [
	// 	{
	// 		label: 'Đánh đấu là đã đọc',
	// 		icon: TbChecks,
	// 		onClick: showIncomingAlert,
	// 	},
	// 	{
	// 		label: 'Rời nhóm',
	// 		icon: TbLogout,
	// 		onClick: showIncomingAlert,
	// 	},
	// 	{
	// 		label: 'Xóa cuộc trò chuyện',
	// 		icon: TbTrashX,
	// 		onClick: showIncomingAlert,
	// 	},
	// ];
	// <Menu anchorEl={anchorEl} open={open} onClose={closeMenu} variant="menu">
	// 	{menuOptions.map((option, index) => (
	// 		<MenuItem key={index}>
	// 			<ListItemIcon onClick={option.onClick}>
	// 				<ListItemIcon
	// 					sx={{
	// 						display: 'flex',
	// 						alignItems: 'center',
	// 					}}
	// 				>
	// 					<option.icon size={20} />
	// 				</ListItemIcon>
	// 				<ListItemText>{option.label}</ListItemText>
	// 			</ListItemIcon>
	// 		</MenuItem>
	// 	))}
	// </Menu>
	return (
		<InfiniteScroll
			scrollableTarget={scrollableTarget}
			dataLength={listConversation.length}
			next={fetcher.loadMore}
			hasMore={fetcher.hasMore}
			loader={loader}
			endMessage={
				<Typography fontSize={16} textAlign="center" color="text.secondary">
					{listConversation.length === 0 ? 'Chưa có cuộc trò chuyện nào' : 'Không còn cuộc trò chuyện nào'}
				</Typography>
			}
		>
			<TransitionGroup component={null}>
				{listConversation.map((conv) => (
					<Collapse mountOnEnter key={conv._id}>
						<ConversationItem isActived={conv._id === id} conversation={conv} sx={{ mb: 1 }} />
					</Collapse>
				))}
			</TransitionGroup>
		</InfiniteScroll>
	);
}
