import { GroupAvatar, MyIconButton } from '@components/MUI';
import { AvatarBadge } from '@components/MUI/AvatarBadge';
import { useAppDispatch, useAuth } from '@hooks';
import { Avatar, Box, Grid, IconButton, Typography, Skeleton } from '@mui/material';
import { MessageContext } from '@pages/messages/[id]';
import { toggleShowDetail } from '@redux/slice/messageSettingSlice';
import { getShortName, showIncomingAlert } from '@utils/common';
import { useContext } from 'react';
import { BsFillCameraVideoFill, BsInfoCircleFill, BsTelephoneFill, BsThreeDotsVertical } from 'react-icons/bs';

export function MessageHeader() {
	const { conversation, fetching } = useContext(MessageContext)!;
	const dispatch = useAppDispatch();

	const { user } = useAuth();
	const isDirect = conversation?.members?.length === 2;
	const receiver = isDirect && conversation?.members?.find((member: any) => member.user._id !== user?._id);

	if (receiver) {
		conversation.avatar = receiver.user.profilePicture;
		conversation.name = receiver.user.fullname;
	}

	if (fetching) return <MessageHeaderSkeleton />;

	return (
		<Grid container justifyContent="space-between" flexWrap="nowrap">
			{/* Conversation Avatar + Name */}
			<Grid item xs="auto">
				<IconButton>
					<AvatarBadge active>
						{conversation?.avatar?.link ? (
							<Avatar
								alt={conversation.name}
								src={conversation.avatar?.link}
								sx={{
									width: 48,
									height: 48,
								}}
							>
								{getShortName(conversation.name)}
							</Avatar>
						) : (
							<GroupAvatar listMember={conversation.members} size={48} />
						)}
					</AvatarBadge>
				</IconButton>
			</Grid>
			<Grid item xs overflow="hidden" justifyContent="center" display="flex" flexDirection="column" py="8px">
				<Typography fontSize={18} fontWeight={700} noWrap>
					{isDirect ? receiver.nickname || receiver?.user?.fullname : conversation.name}
				</Typography>
				<Typography variant="caption">Đang hoạt động</Typography>
			</Grid>
			<Grid item xs="auto" display="flex" alignItems="center">
				<Box justifyContent="center" display="flex">
					{/* Conversation action */}
					<MyIconButton
						tooltip="Gọi thoại"
						Icon={BsTelephoneFill}
						variant="color"
						sx={{
							display: {
								xs: 'none',
								sm: 'inline',
							},
						}}
						onClick={showIncomingAlert}
					/>
					<MyIconButton
						tooltip="Gọi video"
						Icon={BsFillCameraVideoFill}
						variant="color"
						sx={{
							display: {
								xs: 'none',
								sm: 'inline',
							},
						}}
						onClick={showIncomingAlert}
					/>
					<MyIconButton
						tooltip="Thêm"
						Icon={BsThreeDotsVertical}
						variant="color"
						sx={{
							display: {
								xs: 'inline',
								sm: 'none',
							},
						}}
						onClick={console.log}
					/>
					<MyIconButton
						key="info-button"
						tooltip="Thông tin"
						Icon={BsInfoCircleFill}
						variant="color"
						onClick={() => dispatch(toggleShowDetail())}
					/>
				</Box>
			</Grid>
		</Grid>
	);
}

export const MessageHeaderSkeleton = () => (
	<Grid container justifyContent="space-between" flexWrap="nowrap">
		{/* Conversation Avatar + Name */}
		<Grid item xs="auto">
			<IconButton>
				<Skeleton variant="circular" width={48} height={48} />
			</IconButton>
		</Grid>
		<Grid item xs overflow="hidden" justifyContent="center" display="flex" flexDirection="column" py="8px">
			<Skeleton variant="text" width={200} height={24} />
			<Skeleton variant="text" width={100} height={16} />
		</Grid>
		<Grid item xs="auto" display="flex" alignItems="center">
			<Box justifyContent="center" display="flex">
				{/* Conversation action */}
				<MyIconButton
					tooltip="Gọi thoại"
					Icon={BsTelephoneFill}
					variant="color"
					sx={{
						display: {
							xs: 'none',
							sm: 'inline',
						},
					}}
					onClick={console.log}
				/>
				<MyIconButton
					tooltip="Gọi video"
					Icon={BsFillCameraVideoFill}
					variant="color"
					sx={{
						display: {
							xs: 'none',
							sm: 'inline',
						},
					}}
					onClick={showIncomingAlert}
				/>
				<MyIconButton
					tooltip="Thêm"
					Icon={BsThreeDotsVertical}
					variant="color"
					sx={{
						display: {
							xs: 'inline',
							sm: 'none',
						},
					}}
					onClick={console.log}
				/>
				<MyIconButton
					key="info-button"
					tooltip="Thông tin"
					Icon={BsInfoCircleFill}
					variant="color"
					onClick={console.log}
				/>
			</Box>
		</Grid>
	</Grid>
);
