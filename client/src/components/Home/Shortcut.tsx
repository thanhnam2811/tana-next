import { UserAvatar } from '@components/MUI';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import { useUserStore } from '@store';
import { getShortName } from '@utils/common';
import { useRouter } from 'next/router';
import { FcRefresh, FcSettings, FcSportsMode } from 'react-icons/fc';
import { IconType } from 'react-icons/lib';

interface Action {
	title: string;
	icon: IconType;
	// eslint-disable-next-line no-unused-vars
	onClick: (action?: Action) => void;
}

const listShortCutAction: Action[] = Array(20)
	.fill(0)
	.map((_, index) => ({
		title: `Action ${index + 1}`,
		icon: FcSettings,
		onClick: (action) => console.log(action?.title),
	}));

export function ShortCut() {
	const { user, logout } = useUserStore();
	const router = useRouter();

	const handleLogOut = () => {
		logout();
	};

	const listAccountAction: Action[] = [
		{
			title: 'Chuyển tài khoản',
			icon: FcRefresh,
			onClick: (action) => {
				console.log(action?.title);
			},
		},
		{
			title: 'Đăng xuất',
			icon: FcSportsMode,
			onClick: handleLogOut,
		},
	];

	return (
		<Box display="flex" flexDirection="column" height="100%">
			<Box
				display="flex"
				gap={2}
				alignItems="center"
				sx={{
					p: '8px',
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: '#1877f22f',
					},
					borderRadius: '8px',
				}}
				onClick={() => router.push('/profile')}
			>
				<UserAvatar user={user!} size={40} />

				<Typography variant="h6">{user?.fullname}</Typography>
			</Box>

			<Divider sx={{ my: 1 }} />

			<Typography variant="h6" sx={{ mx: 1 }}>
				Truy cập nhanh
			</Typography>
			<Box display="flex" flexDirection="column" maxHeight="100%" overflow="auto" flex={1}>
				{listShortCutAction.map((action, index) => (
					<Box
						key={index}
						display="flex"
						alignItems="center"
						sx={{
							p: '8px',
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: '#1877f22f',
							},
							borderRadius: '8px',
						}}
						onClick={() => action.onClick(action)}
					>
						<action.icon size={32} style={{ marginRight: '16px' }} />

						<Typography variant="subtitle2">{action.title}</Typography>
					</Box>
				))}
			</Box>

			<Divider sx={{ my: 1 }} />

			<Typography variant="h6" sx={{ mx: 1 }}>
				Tài khoản
			</Typography>
			<Box display="flex" flexDirection="column" maxHeight="100%" overflow="auto" flex={1}>
				{listAccountAction.map((action, index) => (
					<Box
						key={index}
						display="flex"
						alignItems="center"
						sx={{
							p: '8px',
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: '#1877f22f',
							},
							borderRadius: '8px',
						}}
						onClick={() => action.onClick(action)}
					>
						<action.icon size={32} style={{ marginRight: '16px' }} />

						<Typography variant="subtitle2">{action.title}</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
