import { useSettingStore } from '@store';
import '@styles/global.scss';
import { SERVER_URL } from '@utils/common';
import 'aos/dist/aos.css';
import 'draft-js/dist/Draft.css';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import 'swiper/css';

import { useAuth } from '@modules/auth/hooks';
import { Analytics } from '@vercel/analytics/react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { App, ConfigProvider, theme } from 'antd';

// Set default locale to Vietnamese
dayjs.locale('vi');

export default function NextApp({ Component, pageProps }: AppProps) {
	const { authUser, login } = useAuth();
	const { getSetting } = useSettingStore();
	const { token } = theme.useToken();

	// Fetch user data
	useEffect(() => {
		// fetch setting
		getSetting();

		if (!authUser) {
			// fetch user data if accessToken is exist
			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) login();
		}
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

	return (
		<ConfigProvider>
			<Toaster position="bottom-right" />

			<NextProgress color={token.colorPrimary} delay={300} height={2} />

			<App style={{ backgroundColor: token.colorBgLayout }}>
				<Component {...pageProps} />
			</App>

			<Analytics />
		</ConfigProvider>
	);
}
