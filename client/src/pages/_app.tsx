import { ScrollToTopButton } from '@components/Button';
import { Backdrop, Box, CircularProgress, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { useSettingStore } from '@store';
import '@styles/global.scss';
import { SERVER_URL, VERSION } from '@utils/common';
import { getTheme } from '@utils/theme';
import { App as AntApp, ConfigProvider } from 'antd';
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

import locale from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useAuth } from '@modules/auth/hooks';
import { useSWRConfig } from 'swr';

// Set default locale to Vietnamese
dayjs.locale('vi');

export default function App({ Component, pageProps }: AppProps) {
	const { authUser, login } = useAuth();
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
		if (accessToken) login().finally(() => setIsFetching(false));
		else setIsFetching(false);
	}, []);

	// Socket
	useEffect(() => {
		window.socket = io(SERVER_URL, { autoConnect: false });
		if (authUser) {
			window.socket.connect();
			window.socket.on('connect', () => {
				window.socket.emit('login', authUser?._id); // login to socket
			});
		}
		return () => {
			if (authUser) {
				window.socket.off('connect');
				window.socket.disconnect(); // disconnect to socket
			}
		};
	}, [authUser?._id]);

	const { mutate } = useSWRConfig();
	useEffect(() => {
		mutate('*', undefined, true);
	}, [authUser?._id]);

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
		<ConfigProvider locale={locale}>
			<Head>
				<title>TaNa - Kết nối và sáng tạo</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="/TaNa-logo.svg" />
			</Head>

			<NextProgress color="#29D" delay={300} height={2} />

			<Toaster position="bottom-right" />

			<ThemeProvider theme={getTheme('light')}>
				<CssBaseline />

				<AntApp>
					<Component {...pageProps} />
				</AntApp>

				{/* Scroll to top */}
				<ScrollToTopButton />

				{/* Version */}
				<Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 999, pointerEvents: 'none' }}>
					<Typography variant="caption" color="textSecondary">
						{VERSION}
					</Typography>
				</Box>
			</ThemeProvider>
		</ConfigProvider>
	);
}
