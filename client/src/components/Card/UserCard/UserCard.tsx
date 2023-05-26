import { useUserStore } from '@store';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent, CardMedia, Chip, SxProps, Typography } from '@mui/material';
import { userApi } from '@utils/api';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiCheckCircle, HiPlusCircle, HiUser, HiUserMinus, HiUserPlus, HiXCircle } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export type Relationship = 'friend' | 'sent' | 'received' | 'none' | 'you';

type ChipRelationship = {
	[key in Relationship]: {
		label: string;
		color: 'success' | 'info' | 'secondary' | 'default' | 'error' | 'warning' | 'primary';
		Icon: IconType;
	};
};

const chipMap: ChipRelationship = {
	friend: {
		label: 'Bạn bè',
		color: 'success',
		Icon: HiCheckCircle,
	},
	sent: {
		label: 'Đã gửi lời mời',
		color: 'info',
		Icon: HiUserPlus,
	},
	received: {
		label: 'Chờ xác nhận',
		color: 'info',
		Icon: HiPlusCircle,
	},
	none: {
		label: 'Chưa kết bạn',
		color: 'secondary',
		Icon: HiUserMinus,
	},
	you: {
		label: 'Bạn',
		color: 'primary',
		Icon: HiUser,
	},
};

interface Props {
	user: any;
	relationship?: Relationship;
	sx?: SxProps;
	onClick?: (user: any) => void;
}

export const UserCard = ({ user, relationship = 'friend', sx = {}, onClick }: Props) => {
	const router = useRouter();
	const { user: currentUser } = useUserStore();
	const isCurrentUser = user._id === currentUser?._id;

	const [loading, setLoading] = useState(false);
	const [relationshipState, setRelationshipState] = useState(relationship);

	const handleRequestFriend = async (e: any) => {
		e.stopPropagation();
		setLoading(true);
		try {
			await userApi.requestFriend(user._id);
			setRelationshipState('sent');
			toast.success('Gửi lời mời thành công');
		} catch (error: any) {
			toast.error(error.toString());
		}

		setLoading(false);
	};

	const handleCancelRequest = async (e: any) => {
		e.stopPropagation();
		setLoading(true);
		try {
			await userApi.requestFriend(user._id); // resend request to cancel friend request
			setRelationshipState('none');
			toast.success('Hủy lời mời thành công');
		} catch (error: any) {
			toast.error(error.toString());
		}
		setLoading(false);
	};

	const handleAcceptRequest = async (e: any) => {
		e.stopPropagation();
		setLoading(true);
		try {
			await userApi.acceptFriend(user._id);
			setRelationshipState('friend');
			toast.success(`Bạn và ${user.fullname} đã trở thành bạn bè`);
		} catch (error: any) {
			toast.error(error.toString());
		}
		setLoading(false);
	};

	const handleRemoveFriend = async (e: any) => {
		e.stopPropagation();
		setLoading(true);
		try {
			await userApi.unFriend(user._id);
			setRelationshipState('none');
			toast.success('Xóa thành công');
		} catch (error: any) {
			toast.error(error.toString());
		}
		setLoading(false);
	};

	const handleViewProfile = () => router.push({ pathname: '/profile', query: { id: user._id } });

	const renderActionButton = () => {
		switch (relationshipState) {
			case 'friend':
				return (
					<LoadingButton
						variant="contained"
						color="error"
						loading={loading}
						loadingPosition="start"
						startIcon={<HiUserMinus />}
						sx={{
							textTransform: 'none',
							mr: 1,
						}}
						onClick={handleRemoveFriend}
					>
						{loading ? 'Đang xử lý' : 'Hủy kết bạn'}
					</LoadingButton>
				);
			case 'sent':
				return (
					<LoadingButton
						variant="contained"
						color="warning"
						loading={loading}
						loadingPosition="start"
						startIcon={<HiXCircle />}
						sx={{
							textTransform: 'none',
							mr: 1,
						}}
						onClick={handleCancelRequest}
					>
						{loading ? 'Đang hủy' : 'Hủy yêu cầu'}
					</LoadingButton>
				);
			case 'received':
				return (
					<LoadingButton
						variant="contained"
						color="success"
						loading={loading}
						loadingPosition="start"
						startIcon={<HiCheckCircle />}
						sx={{
							textTransform: 'none',
							mr: 1,
						}}
						onClick={handleAcceptRequest}
					>
						{loading ? 'Đang xử lý' : 'Chấp nhận'}
					</LoadingButton>
				);
			case 'none':
				return (
					<LoadingButton
						variant="contained"
						color="success"
						loading={loading}
						loadingPosition="start"
						startIcon={<HiUserPlus />}
						sx={{
							textTransform: 'none',
							mr: 1,
						}}
						onClick={handleRequestFriend}
					>
						{loading ? 'Đang gửi' : 'Kết bạn'}
					</LoadingButton>
				);
		}
	};

	const renderChip = () => {
		const { label, color, Icon } = chipMap[relationshipState];
		return isCurrentUser ? (
			<Chip icon={<HiUser />} label="Bạn" variant="outlined" color="info" />
		) : (
			<Chip icon={<Icon />} label={label} variant="outlined" color={color} />
		);
	};

	return (
		<Card
			sx={{
				display: 'flex',
				boxShadow: 4,
				cursor: 'pointer',
				'&:hover': {
					transform: 'scale(1.02)',
				},
				transition: 'all 0.2s ease-in-out',
				...sx,
			}}
			onClick={onClick}
		>
			<CardMedia
				component="img"
				sx={{
					width: 160,
					height: 160,
					objectFit: 'cover',
					alignSelf: 'center',
					p: 1,
					borderRadius: '16px',
				}}
				image={user.profilePicture?.link || ''}
				alt={user.profilePicture?.name}
			/>
			<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
				<CardContent sx={{ flex: '1 0 auto', p: 1, pl: 2 }}>
					<Box display="flex" justifyContent="space-between">
						<Typography variant="h5" fontWeight={800}>
							{user.fullname}
						</Typography>
						{renderChip()}
					</Box>
					<Typography variant="subtitle1" color="text.secondary" component="div">
						{user.email}
					</Typography>
				</CardContent>
				<Box sx={{ display: 'flex', alignItems: 'center', p: 1, pl: 2 }}>
					<Button
						variant="contained"
						color="info"
						sx={{
							textTransform: 'none',
							mr: 1,
						}}
						startIcon={<HiUser />}
						onClick={handleViewProfile}
					>
						Trang cá nhân
					</Button>

					{!isCurrentUser && renderActionButton()}
				</Box>
			</Box>
		</Card>
	);
};
