import { ScrollToTopButton } from '@components/Button';
import { useAppDispatch, useAuth } from '@hooks';
import { Backdrop, Box, CircularProgress, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { setUser } from '@redux/slice/userSlice';
import { store } from '@redux/store';
import { authApi } from '@utils/api';
import { SERVER_URL, VERSION } from '@utils/common';
import { getTheme } from '@utils/theme';
import { ReactNode, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { NavBar } from './NavBar';
// boxShadow: '0 20px 27px 0 rgb(0 0 0 / 5%)'

interface Props {
	children: ReactNode;
}

export function LayoutWrapper({ children }: Props) {
	const { user } = useAuth();

	// Fetch user data
	const dispatch = useAppDispatch();
	const [isFetching, setIsFetching] = useState(true);
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await authApi.getProfile();
				const user = res.data;
				dispatch(setUser(user));
			} catch (error: any) {
				toast.error(error.toString());
			}
			setIsFetching(false);
		};

		// fetch user data if accessToken is exist
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) fetchUserData();
		else setIsFetching(false);
	}, []);

	// Socket
	useEffect(() => {
		window.socket = io(SERVER_URL, { autoConnect: false });
		if (user) {
			window.socket.connect();
			window.socket.on('connect', () => {
				window.socket.emit('login', user?._id); // login to socket
			});
		}
		return () => {
			if (user) {
				window.socket.off('connect');
				window.socket.disconnect(); // disconnect to socket
			}
		};
	}, [user?._id]);

	if (isFetching)
		return (
			<Backdrop
				sx={{
					bgcolor: '#fff',
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open
			>
				<CircularProgress color="primary" />
			</Backdrop>
		);

	return (
		<Provider store={store}>
			<Toaster position="bottom-right" />

			<ThemeProvider theme={getTheme('light')}>
				<CssBaseline />
				<NavBar />

				<Box sx={{ minHeight: 'calc(100vh - 64px)', mt: '64px', display: 'flex' }}>{children}</Box>

				{/* Scroll to top */}
				<ScrollToTopButton />

				{/* Version */}
				<Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 999, pointerEvents: 'none' }}>
					<Typography variant="caption" color="textSecondary">
						{VERSION}
					</Typography>
				</Box>
			</ThemeProvider>
		</Provider>
	);
}
