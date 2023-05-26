import { ScrollToTopButton } from '@components/Button';
import { NavBar } from '@layout';
import { Backdrop, Box, CircularProgress, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { useSettingStore, useUserStore } from '@store';
import '@styles/global.css';
import { SERVER_URL, VERSION } from '@utils/common';
import { getTheme } from '@utils/theme';
import { ConfigProvider } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'draft-js/dist/Draft.css';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import 'swiper/css';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/lib/locale/vi_VN';

// Set default locale to Vietnamese
dayjs.locale('vi');

export default function App({ Component, pageProps }: AppProps) {
	const { user, getProfile } = useUserStore();
	const { getSetting } = useSettingStore();

	// Fetch user data
	const [isFetching, setIsFetching] = useState(true);
	useEffect(() => {
		// init AOS
		AOS.init({
			throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
		});

		// fetch setting
		getSetting();

		// fetch user data if accessToken is exist
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) getProfile().finally(() => setIsFetching(false));
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
		<>
			<Head>
				<title>TaNa - Kết nối và sáng tạo</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="/TaNa-logo.svg" />
			</Head>

			<NextProgress color="#29D" delay={300} height={2} />

			<Toaster position="bottom-right" />

			<ThemeProvider theme={getTheme('light')}>
				<CssBaseline />
				<NavBar />

				<Box sx={{ minHeight: 'calc(100vh - 64px)', mt: '64px', display: 'flex' }}>
					<ConfigProvider locale={locale}>
						<Component {...pageProps} />
					</ConfigProvider>
				</Box>

				{/* Scroll to top */}
				<ScrollToTopButton />

				{/* Version */}
				<Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 999, pointerEvents: 'none' }}>
					<Typography variant="caption" color="textSecondary">
						{VERSION}
					</Typography>
				</Box>
			</ThemeProvider>
		</>
	);
}
