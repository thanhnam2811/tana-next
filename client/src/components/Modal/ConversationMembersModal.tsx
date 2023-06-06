import { useAuth } from '@modules/auth/hooks';
import { LoadingButton } from '@mui/lab';
import {
	Avatar,
	Button,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	OutlinedInput,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { UpdateMembersType, conversationApi } from '@utils/api';
import { messageApi } from '@utils/api/message-api';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
	BsCalendarPlus,
	BsChat,
	BsFillPersonPlusFill,
	BsPenFill,
	BsPersonCircle,
	BsPersonFill,
	BsShieldLockFill,
	BsTrashFill,
} from 'react-icons/bs';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { stringUtil } from '@utils/common';
import { MyIconButton } from '@components/MUI';
import dayjs from 'dayjs';

interface Props {
	open: boolean;
	onClose: () => void;
	member: any;
	// eslint-disable-next-line no-unused-vars
	handleUpdateMembers: (type: UpdateMembersType, data: any) => void;
}

export const ConversationMembersModal = ({ open, onClose, member = {}, handleUpdateMembers }: Props) => {
	const router = useRouter();
	const { authUser } = useAuth();

	const { user = {}, role, nickname, addedBy = {}, addedAt, changedNicknameBy } = member;

	const isCurrentUser = authUser?._id === user?._id;

	useEffect(() => {
		handleCloseSendMsg(); // close send message dialog when close modal
	}, [open]);

	const listRole = [
		{
			label: 'Thành viên',
			value: 'member',
		},
		{
			label: 'Quản trị viên',
			value: 'admin',
		},
	];

	const [nickNameState, setNickNameState] = useState<string>(nickname);
	const isNickNameChanged = nickNameState?.trim() !== nickname?.trim();
	useEffect(() => {
		setNickNameState(nickname || '');
	}, [nickname]);

	const [loading, setLoading] = useState<{
		role?: boolean;
		nickname?: boolean;
		delete?: boolean;
		sendMessage?: boolean;
	}>({
		role: false,
		nickname: false,
		delete: false,
		sendMessage: false,
	});

	const handleSaveNickname = async () => {
		setLoading((prev) => ({ ...prev, nickname: true }));
		try {
			await handleUpdateMembers('changeNickname', {
				userID: user._id,
				nickname: nickNameState,
			});
		} catch (error: any) {
			toast.error(error?.toString());
		}
		setLoading((prev) => ({ ...prev, nickname: false }));
	};

	const handleToggleRole = async () => {
		setLoading((prev) => ({ ...prev, role: true }));
		try {
			await handleUpdateMembers('changeRole', {
				userID: user._id,
				role: role === 'member' ? 'admin' : 'member',
			});
		} catch (error: any) {
			toast.error(error?.toString());
		}
		setLoading((prev) => ({ ...prev, role: false }));
	};

	const handleDeleteMember = async () => {
		Swal.fire({
			icon: 'warning',
			title: 'Xóa thành viên!',
			html: `Bạn có chắc chắn muốn xóa <b>${user.fullname}</b> khỏi cuộc trò chuyện này?`,
			showCancelButton: true,
			confirmButtonText: `Xóa`,
			confirmButtonColor: '#ff0000',
			cancelButtonText: `Hủy`,
		}).then(async (result) => {
			if (result.isConfirmed) {
				setLoading((prev) => ({ ...prev, delete: true }));
				try {
					// Call api
					await handleUpdateMembers('remove', {
						userID: user._id,
					});

					// Close modal
					onClose();

					// Show toast
					toast.success('Xóa thành viên thành công');
				} catch (error: any) {
					toast.error(error?.toString());
				}
				setLoading((prev) => ({ ...prev, delete: false }));
			}
		});
	};

	const inputMessageRef = useRef<HTMLInputElement>(null);
	const [openSendMsg, setOpenSendMsg] = useState(false);
	const handleOpenSendMsg = () => {
		inputMessageRef.current?.focus();
		setOpenSendMsg(true);
	};
	const handleCloseSendMsg = () => setOpenSendMsg(false);

	const handleSendMessage = async () => {
		const message = inputMessageRef.current?.value;

		if (!message?.trim()) return;

		setLoading((prev) => ({ ...prev, sendMessage: true }));
		try {
			//	Create conversation
			const res = await conversationApi.create({
				members: [{ user: user._id }],
				name: user.fullname,
			});
			const conv = res.data;

			// Send a message to new conversation
			await messageApi.create(conv._id, { message });

			// Show toast
			toast.success('Gửi tin nhắn thành công');

			// Redirect to new conversation
			router.push(`/conversation/${conv._id}`);
		} catch (error: any) {
			// Show toast
			toast.error(error?.toString());
		}
		setLoading((prev) => ({ ...prev, sendMessage: false }));
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{isCurrentUser ? 'Thông tin của bạn' : 'Thông tin thành viên'}</DialogTitle>

			<DialogContent sx={{ width: 400 }}>
				<Stack direction="row" columnGap={2}>
					<Avatar
						src={user.profilePicture?.link}
						alt={user.fullname}
						sx={{
							width: 80,
							height: 80,
						}}
					>
						{stringUtil.getShortName(user.fullname)}
					</Avatar>

					<Stack direction="column" flex={1} overflow="hidden">
						<Typography
							fontSize="1.25rem"
							fontWeight="bold"
							noWrap
							overflow="hidden"
							textOverflow="ellipsis"
						>
							{nickname || user.fullname} {isCurrentUser && '(Bạn)'}
						</Typography>

						<Typography fontSize="0.875rem" color="text.secondary">
							Thêm bởi <b>{addedBy.fullname}</b> vào <b>{dayjs(addedAt).format('DD/MM/YYYY')}</b>
						</Typography>
					</Stack>

					{!isCurrentUser && (
						<Stack direction="column" ml="auto" spacing={1}>
							<MyIconButton
								tooltip="Xem trang cá nhân"
								Icon={BsPersonCircle}
								variant="color"
								sx={{
									display: {
										xs: 'none',
										sm: 'inline',
									},
									p: 0,
								}}
								onClick={() => router.push(`/profile/${user._id}`)}
								placement="right"
							/>
							<MyIconButton
								tooltip="Nhắn tin"
								Icon={BsChat}
								variant="color"
								sx={{
									display: {
										xs: 'none',
										sm: 'inline',
									},
									p: 0,
								}}
								onClick={openSendMsg ? handleCloseSendMsg : handleOpenSendMsg}
								placement="right"
							/>
						</Stack>
					)}
				</Stack>

				<Collapse in={openSendMsg}>
					<TextField
						inputRef={inputMessageRef}
						label="Nội dung"
						multiline
						rows={4}
						variant="outlined"
						fullWidth
						sx={{ mt: 2 }}
						placeholder="Nhập nội dung tin nhắn"
					/>
					<Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
						<Button variant="outlined" color="primary" onClick={handleCloseSendMsg}>
							Hủy
						</Button>
						<LoadingButton
							variant="contained"
							color="primary"
							onClick={handleSendMessage}
							loading={loading.sendMessage}
						>
							Gửi
						</LoadingButton>
					</Stack>
				</Collapse>

				<FormControl fullWidth sx={{ mt: 2 }}>
					<InputLabel>Biệt danh</InputLabel>
					<OutlinedInput
						label="Biệt danh"
						value={nickNameState}
						onChange={(e) => setNickNameState(e.target.value)}
						endAdornment={<BsPenFill size={22} />}
					/>
					<FormHelperText>
						{nickname ? (
							<>
								Đã thay đổi biệt danh bởi: <b>{changedNicknameBy?.fullname}</b>
							</>
						) : (
							'Biệt danh sẽ được hiển thị thay vì tên đầy đủ'
						)}
					</FormHelperText>

					<Collapse in={isNickNameChanged}>
						<Stack direction="row" justifyContent="flex-end" spacing={1}>
							<Button variant="outlined" onClick={() => setNickNameState(nickname || '')}>
								Hủy
							</Button>
							<LoadingButton variant="contained" loading={loading.nickname} onClick={handleSaveNickname}>
								Lưu
							</LoadingButton>
						</Stack>
					</Collapse>
				</FormControl>

				<FormControl fullWidth sx={{ mt: 2 }}>
					<InputLabel>Vai trò</InputLabel>
					<OutlinedInput
						readOnly
						label="Vai trò"
						value={listRole.find((item) => item.value === role)?.label}
						endAdornment={role === 'admin' ? <BsShieldLockFill size={22} /> : <BsPersonFill size={22} />}
					/>
				</FormControl>

				<FormControl fullWidth sx={{ mt: 2 }}>
					<InputLabel>Ngày tham gia</InputLabel>
					<OutlinedInput
						readOnly
						label="Ngày tham gia"
						value={dayjs(addedAt).format('DD/MM/YYYY')}
						endAdornment={<BsCalendarPlus size={22} />}
					/>
				</FormControl>

				<FormControl fullWidth sx={{ mt: 2 }}>
					<InputLabel>Người mời</InputLabel>
					<OutlinedInput
						readOnly
						label="Người mời"
						value={addedBy.fullname}
						endAdornment={<BsFillPersonPlusFill size={22} />}
					/>
				</FormControl>
			</DialogContent>

			<DialogActions>
				{!isCurrentUser && (
					<LoadingButton
						variant="contained"
						color={role === 'admin' ? 'error' : 'success'}
						startIcon={role === 'admin' ? <BsPersonFill /> : <BsShieldLockFill />}
						sx={{ mr: 'auto' }}
						loading={loading.role}
						loadingPosition="start"
						onClick={handleToggleRole}
					>
						{loading.role ? 'Đang xử lý' : role === 'admin' ? 'Xóa quyền admin' : 'Thêm làm admin'}
					</LoadingButton>
				)}

				{!isCurrentUser && (
					<LoadingButton
						variant="outlined"
						color="error"
						startIcon={<BsTrashFill />}
						loading={loading.delete}
						loadingPosition="start"
						onClick={handleDeleteMember}
					>
						{loading.delete ? 'Đang xóa' : 'Xóa'}
					</LoadingButton>
				)}
				<Button variant="outlined" onClick={onClose}>
					Đóng
				</Button>
			</DialogActions>
		</Dialog>
	);
};
