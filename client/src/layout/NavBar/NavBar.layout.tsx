import React from 'react';

import { Logo } from '@assets/logo';
import { useAuth } from '@hooks';
import { Avatar, Button, Grid, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/router';
import { FiBell, FiHome, FiMenu, FiMessageSquare, FiSearch, FiUser, FiUsers } from 'react-icons/fi';
import { LeftSide } from './LeftSide.layout';
import { RightSide } from './RightSide.layout';

const pages = [
	{
		label: 'Trang chủ',
		icon: FiHome,
		path: '/home',
	},
	{
		label: 'Bạn bè',
		icon: FiUsers,
		path: '/friends',
	},
	{
		label: 'Tin nhắn',
		icon: FiMessageSquare,
		path: '/messages',
	},
	{
		label: 'Trang cá nhân',
		icon: FiUser,
		path: '/profile',
		display: {
			xs: 'none',
			sm: 'block',
		},
	},
	{
		label: 'Tìm kiếm',
		icon: FiSearch,
		display: {
			xs: 'block',
			md: 'none',
		},
		path: '/search',
	},
	{
		label: 'Thông báo',
		icon: FiBell,
		display: {
			xs: 'block',
			sm: 'none',
		},
		path: '/notification',
	},
	{
		label: 'Menu',
		icon: FiMenu,
		display: {
			xs: 'block',
			sm: 'none',
		},
		path: '/menu',
	},
];

export function NavBar() {
	const theme = useTheme();

	const router = useRouter();

	const { pathname } = router;

	const { user } = useAuth();

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		router.push(newValue);
	};

	const getValueTab = () => {
		const path = pages.find(({ path }) => pathname.startsWith(path))?.path;
		return path || false;
	};

	return (
		<AppBar position="fixed" sx={{ boxShadow: 1, backgroundColor: 'white' }}>
			<Toolbar disableGutters>
				{user ? (
					<Grid component="div" container sx={{ minHeight: 'inherit' }}>
						{/* Left Area */}
						<LeftSide />

						{/* Main Nav Area */}
						<Grid
							component="div"
							className="hide-scrollbar"
							item
							xs={12}
							sm
							sx={{
								display: 'flex',
								justifyContent: {
									sm: 'center',
									xs: 'space-between',
								},
								alignItems: 'center',
							}}
						>
							<Tabs
								variant="scrollable"
								value={getValueTab()}
								onChange={handleChange}
								aria-label="icon nav"
								sx={{
									height: '100%',
									'& div': {
										height: '100%',
									},
									'& button': {
										color: theme.palette.secondary.main,
									},
								}}
							>
								{pages.map((page, index) => (
									<Tab
										value={page.path}
										key={index}
										icon={<page.icon color="inherit" size={24} />}
										aria-label={page.label}
										sx={{
											display: page.display,
											height: '100%',
										}}
									/>
								))}
							</Tabs>
						</Grid>

						{/* Right Nav Area */}
						<RightSide />
					</Grid>
				) : (
					<Stack spacing={1} direction="row" width="100%" justifyContent="space-between" mx={2}>
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
							onClick={() => router.push('/')}
							sx={{ cursor: 'pointer' }}
						>
							<Avatar alt="Logo" src={Logo.src} />
							<Typography
								color="primary"
								display={{
									xs: 'none',
									sm: 'block',
								}}
							>
								TaNa - Kết nối và sáng tạo
							</Typography>
						</Stack>

						<Stack direction="row" spacing={1} alignItems="center">
							<Button
								variant="contained"
								onClick={() => router.push('/auth/login')}
								sx={{ float: 'right' }}
							>
								Đăng nhập
							</Button>

							<Button
								color="primary"
								variant="outlined"
								onClick={() => router.push('/auth/register')}
								sx={{ float: 'right' }}
							>
								Đăng ký
							</Button>
						</Stack>
					</Stack>
				)}
			</Toolbar>
		</AppBar>
	);
}
