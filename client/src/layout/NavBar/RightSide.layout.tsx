import { useEffect, useState } from 'react';

import { MyIconButton } from '@components/MUI';
import { useInfiniteFetcher } from '@hooks';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import {
	Avatar,
	Badge,
	Divider,
	Grid,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from '@mui/material';
import { useUserStore } from '@store';
import { stringUtil } from '@utils/common';
import { useRouter } from 'next/router';
import { FcFaq, FcLike, FcStackOfPhotos } from 'react-icons/fc';
import { FiBell } from 'react-icons/fi';

const listTypeNotify = [
	{
		type: 'comment',
		icon: FcFaq,
	},
	{
		type: 'post',
		icon: FcStackOfPhotos,
	},
	{
		type: 'react',
		icon: FcLike,
	},
];

export function RightSide() {
	const { user, logout } = useUserStore();

	const [profileMenuEl, setProfileMenuEl] = useState<any>();
	const openProfileMenu = Boolean(profileMenuEl);

	const [notifyMenuEl, setNotifyMenuEl] = useState<any>();
	const openNotifyMenu = Boolean(notifyMenuEl);

	const handleLogOut = () => {
		logout();
	};

	const router = useRouter();
	const { pathname } = router;

	const navigateToProfile = () => {
		if (!pathname.includes(`/profile/${user?._id}`)) router.push(`/profile/${user?._id}`);
	};

	const notiFetcher = useInfiniteFetcher('users/notifications');
	const notifications = notiFetcher.data;
	useEffect(() => {
		notiFetcher.reload();
	}, [user?._id]);

	return (
		<Grid
			component="div"
			item
			xs="auto"
			sx={{
				display: {
					xs: 'none',
					sm: 'flex',
				},
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<MyIconButton
				tooltip={'Thông báo'}
				onClick={(e) => setNotifyMenuEl(e.target)}
				notifyCount={10}
				Icon={FiBell}
			/>

			<Menu
				sx={{
					marginTop: 1,
					marginRight: 1,
				}}
				anchorEl={notifyMenuEl}
				open={openNotifyMenu}
				onClose={() => setNotifyMenuEl(null)}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{notifications.map((notify) => {
					const Icon = listTypeNotify.find((item) => notify.type === item.type)?.icon;

					const { sender } = notify;

					return (
						<MenuItem
							key={notify._id}
							sx={{
								marginBottom: 1,
								maxWidth: {
									sm: '400px',
									lg: '600px',
								},
							}}
						>
							<Badge
								sx={{
									marginRight: 1,
								}}
								overlap="circular"
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								badgeContent={
									<Avatar
										sx={{
											width: 22,
											height: 22,
											bgcolor: 'white',
										}}
									>
										{Icon && <Icon size={20} />}
									</Avatar>
								}
							>
								<Avatar alt={sender?.fullname} src={sender?.profilePicture?.link}>
									{stringUtil.getShortName(sender?.fullname)}
								</Avatar>
							</Badge>
							<Typography variant="body2" sx={{ whiteSpace: 'normal' }}>
								{notify.content}
							</Typography>
						</MenuItem>
					);
				})}
			</Menu>

			<Tooltip title={user?.fullname || ''}>
				<IconButton onClick={(e) => setProfileMenuEl(e.target)}>
					<Avatar alt="Ảnh đại diện" src={user?.profilePicture?.link as string}>
						{stringUtil.getShortName(user?.fullname)}
					</Avatar>
				</IconButton>
			</Tooltip>

			<Menu
				sx={{
					marginTop: 1,
				}}
				anchorEl={profileMenuEl}
				open={openProfileMenu}
				onClose={() => setProfileMenuEl(null)}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={navigateToProfile}>
					<ListItemIcon>
						<AccountCircleRoundedIcon fontSize="small" />
					</ListItemIcon>
					Trang cá nhân
				</MenuItem>
				<Divider />
				<MenuItem>
					<ListItemIcon>
						<PersonAdd fontSize="small" />
					</ListItemIcon>
					Thêm tài khoản
				</MenuItem>
				<MenuItem>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Cài đặt
				</MenuItem>

				{/* <MenuItem onClick={() => setIsLightTheme((prev) => !prev)}>
					<ListItemIcon>
						{isLightTheme ? (
							<DarkModeRoundedIcon fontSize="small" />
						) : (
							<LightModeRoundedIcon fontSize="small" />
						)}
					</ListItemIcon>
					Chế độ {isLightTheme ? 'tối' : 'sáng'}
				</MenuItem> */}

				<MenuItem onClick={handleLogOut}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Đăng xuất
				</MenuItem>
			</Menu>
		</Grid>
	);
}
