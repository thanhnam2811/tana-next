import { AvatarBadge } from '@components/MUI/AvatarBadge';
import { Avatar, Badge, Box, Button, IconButton, Stack, SxProps, Tooltip, Typography } from '@mui/material';
import { useAuth } from '@modules/auth/hooks';
import { conversationApi, fileApi, userApi } from '@utils/api';
import { stringUtil } from '@utils/common';
import { useRouter } from 'next/router';
import { ChangeEvent, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { HiCamera, HiChat } from 'react-icons/hi';

const iconStyle: SxProps = {
	bgcolor: 'white',
	boxShadow: 4,
	'&:hover': {
		bgcolor: 'white',
		'& svg': {
			color: 'primary.main',
			transform: 'scale(1.2)',
		},
	},
	transition: 'all 0.2s ease-in-out',
	'& svg': {
		transition: 'all 0.2s ease-in-out',
	},
};

interface Props {
	user: any;
}

export const PictureContainer = ({ user }: Props) => {
	const router = useRouter();
	const { authUser, updateAuthUser } = useAuth();

	const isCurrentUser = authUser?._id === user._id;
	if (isCurrentUser) user = authUser;

	const inputCoverPicRef = useRef<HTMLInputElement>(null);
	const handleChangeCoverPic = async (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files?.length) {
			try {
				// Upload file
				const toastId = toast.loading('Đang tải ảnh lên...');
				const { data } = await fileApi.upload(files);
				const file = data.files[0];

				// Optimistic update
				updateAuthUser({ coverPicture: file._id }, { coverPicture: file });

				// Update cover picture
				toast.loading('Đang cập nhật ảnh bìa...', { id: toastId });
				await userApi.update({ coverPicture: file._id });

				// Show toast
				toast.success('Cập nhật ảnh bìa thành công!', { id: toastId });
			} catch (error) {
				toast.error(error?.toString() || 'Có lỗi xảy ra! Vui lòng thử lại');
			}
		}
	};

	const inputProfilePicRef = useRef<HTMLInputElement>(null);
	const handleChangeProfilePic = async (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files?.length) {
			try {
				// Upload file
				const toastId = toast.loading('Đang tải ảnh lên...');
				const { data } = await fileApi.upload(files);
				const file = data.files[0];

				// Optimistic update
				updateAuthUser({ coverPicture: file._id }, { coverPicture: file });

				// Update profile picture
				toast.loading('Đang cập nhật ảnh đại diện...', { id: toastId });
				await userApi.update({ profilePicture: file._id });

				// Show toast
				toast.success('Cập nhật ảnh đại diện thành công!', { id: toastId });
			} catch (error) {
				toast.error(error?.toString() || 'Có lỗi xảy ra! Vui lòng thử lại');
			}
		}
	};

	const handleMessageClick = async () => {
		try {
			// Create conversation
			const { data: conversation } = await conversationApi.create({
				members: [{ user: user._id }],
				name: user.fullname,
			});

			// Redirect to conversation
			router.push(`/messages/${conversation._id}`);
		} catch (error: any) {
			toast.error(error?.toString() || 'Có lỗi xảy ra! Vui lòng thử lại');
		}
	};

	return (
		<>
			<Box
				sx={{
					width: '100%',
					bgcolor: 'grey.500',
					backgroundImage: `url(${user.coverPicture?.link})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					borderRadius: '16px',
					position: 'relative',
					aspectRatio: '20/9',
					boxShadow: 4,
				}}
			>
				{/* Icon button change cover picture */}
				{isCurrentUser && (
					<>
						<input
							type="file"
							onChange={handleChangeCoverPic}
							hidden
							accept="image/*"
							ref={inputCoverPicRef}
						/>
						<Tooltip title="Đổi ảnh bìa">
							<IconButton
								sx={{
									my: 'auto',
									position: 'absolute',
									right: '8px',
									zIndex: 50,
									top: '50%',
									transform: 'translateY(-50%)',
									...iconStyle,
								}}
								onClick={() => inputCoverPicRef.current?.click()}
							>
								<HiCamera size={24} />
							</IconButton>
						</Tooltip>
					</>
				)}
			</Box>

			{/* Profile Picture and Name */}
			<Box
				sx={{
					mt: {
						xs: `-${64 / 2 + 4}px`,
						sm: `-${80 / 2 + 4}px`,
						md: `-${120 / 2 + 4}px`,
					},
					ml: 2,
					mb: 2,
				}}
			>
				<Stack alignItems="flex-end" direction="row" flexWrap="wrap">
					{/* Profile Picture */}
					{isCurrentUser && (
						<input
							type="file"
							onChange={handleChangeProfilePic}
							hidden
							accept="image/*"
							ref={inputProfilePicRef}
						/>
					)}
					<Badge
						overlap="circular"
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						badgeContent={
							isCurrentUser && (
								<Tooltip title="Đổi ảnh đại diện">
									<IconButton sx={iconStyle} onClick={() => inputProfilePicRef.current?.click()}>
										<HiCamera />
									</IconButton>
								</Tooltip>
							)
						}
					>
						<AvatarBadge active={user.isOnline}>
							<Avatar
								sx={{
									width: {
										xs: 64,
										sm: 80,
										md: 120,
									},
									height: {
										xs: 64,
										sm: 80,
										md: 120,
									},
									border: '4px solid #fff',
									boxShadow: 4,
								}}
								alt={user.fullname}
								src={user.profilePicture?.link}
							>
								{stringUtil.getShortName(user.fullname)}
							</Avatar>
						</AvatarBadge>
					</Badge>
					<Typography
						fontSize={{
							xs: 20,
							sm: 24,
							md: 28,
						}}
						fontWeight={900}
						color="black"
						sx={{ ml: 1 }}
					>
						{user.fullname}
					</Typography>
					{!isCurrentUser && (
						<Button
							variant="contained"
							color="info"
							sx={{ ml: 'auto', textTransform: 'none' }}
							startIcon={<HiChat />}
							onClick={handleMessageClick}
						>
							Nhắn tin
						</Button>
					)}
				</Stack>
			</Box>
		</>
	);
};
