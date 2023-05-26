import { WhiteBox } from '@components/Box';
import { GroupAvatar } from '@components/MUI';
import { useUserStore } from '@store';
import { Avatar, Box, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { MessageContext } from '@pages/messages/[id]';
import { conversationApi } from '@utils/api';
import { getShortName, showIncomingAlert } from '@utils/common';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { FiBellOff, FiTrash, FiUserPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { ConfigMenu, MembersMenu } from './Menu';
import { ActionItem } from './components/ActionItem';

export function DetailArea() {
	const { conversation, convFetcher, fetching, isDirect } = useContext(MessageContext)!;
	const router = useRouter();

	const { user: currentUser } = useUserStore();

	const handleDeleteConversation = () =>
		Swal.fire({
			title: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này?',
			text: 'Bạn sẽ không thể khôi phục lại cuộc trò chuyện này!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			confirmButtonText: 'Xóa',
			cancelButtonText: 'Hủy',
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					// Delete conversation
					await conversationApi.delete(conversation._id);

					// Go to all conversation
					router.push('/messages/all');

					// Remove conversation from list
					convFetcher?.removeData(conversation._id);

					// Show toast
					toast.success('Xóa cuộc trò chuyện thành công!');
				} catch (error: any) {
					// Show toast
					toast.error(error?.message || error);
				}
			}
		});

	const listAction = [
		{
			label: 'Tạo nhóm',
			icon: FiUserPlus,
			onClick: showIncomingAlert,
		},
		{
			label: 'Tắt thông báo',
			icon: FiBellOff,
			onClick: showIncomingAlert,
		},
		{
			label: 'Xóa',
			icon: FiTrash,
			onClick: handleDeleteConversation,
		},
	];

	const receiver = isDirect && conversation.members.find((member: any) => member.user._id !== currentUser?._id);

	if (receiver) {
		conversation.avatar = receiver.user.profilePicture;
		conversation.name = receiver.user.fullname;
	}

	const onAvatarClick = () => {
		if (isDirect) {
			router.push({ pathname: '/profile', query: { id: receiver.user._id } });
		}
	};

	return (
		<WhiteBox sx={{ display: 'flex', flexDirection: 'column' }}>
			{/* Conversation detail */}
			<Grid component="div" container sx={{ p: 2 }}>
				{/* Detail */}
				{fetching ? (
					<DetailSkeleton />
				) : (
					<Grid component="div" item xs={12} display="flex" alignItems="center" flexDirection="column">
						{/* Conversation Avatar */}
						<IconButton onClick={onAvatarClick}>
							{conversation?.avatar?.link ? (
								<Avatar
									alt={conversation.name}
									src={conversation.avatar?.link}
									sx={{
										width: 80,
										height: 80,
									}}
								>
									{getShortName(conversation.name)}
								</Avatar>
							) : (
								<GroupAvatar listMember={conversation.members} size={80} />
							)}
						</IconButton>

						{/* Conversation Name */}
						<Box display="flex" width={'100%'} justifyContent="center">
							<Typography variant="h6" fontWeight={700} noWrap>
								{isDirect ? receiver.nickname || receiver?.user?.fullname : conversation.name}
							</Typography>
						</Box>

						{/* Conversation status */}
						<Typography variant="subtitle2">Đang hoạt động</Typography>
					</Grid>
				)}

				{/* Action */}
				<Grid component="div" item xs={12}>
					<Grid component="div" container>
						{/* Action Item */}
						{listAction.map((action, index) => (
							<ActionItem action={action} key={index} />
						))}
					</Grid>
				</Grid>
			</Grid>

			<Box flexGrow={1} overflow="auto" my="8px">
				<ConfigMenu />

				<MembersMenu />
			</Box>
		</WhiteBox>
	);
}

const DetailSkeleton = () => (
	<Grid component="div" item xs={12} display="flex" alignItems="center" flexDirection="column">
		{/* Conversation Avatar */}
		<IconButton>
			<Skeleton variant="circular" width={80} height={80} />
		</IconButton>

		{/* Conversation Name */}
		<Box display="flex" width={'100%'} justifyContent="center">
			<Skeleton variant="text" width={200} height={28} />
		</Box>

		{/* Conversation status */}
		<Skeleton variant="text" width={80} height={22} />
	</Grid>
);
