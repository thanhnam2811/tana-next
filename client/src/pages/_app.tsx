import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useAuth } from '@modules/auth/hooks';
import { Analytics } from '@vercel/analytics/react';
import { App, ConfigProvider, theme } from 'antd';

import '@styles/global.scss';
import 'aos/dist/aos.css';
import 'draft-js/dist/Draft.css';
import 'swiper/css';

import viVn from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useTheme } from 'src/layout/hooks';
import { SERVER_URL } from '@common/config';

dayjs.locale('vi');

export default function NextApp({ Component, pageProps }: AppProps) {
	const { authUser, login } = useAuth();
	const { mode, getTheme } = useTheme();
	const { token } = theme.useToken();

	// Fetch user data
	useEffect(() => {
		// fetch theme
		getTheme();

		if (!authUser) {
			// fetch user data if accessToken exist
			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) login();
		}
	}, []);

	// Socket
	useEffect(() => {
		window.socket = io(SERVER_URL!, { autoConnect: false });
		if (authUser) {
			window.socket.connect();
			window.socket.on('connect', () => {
				const accessToken = localStorage.getItem('accessToken');
				window.socket.emit('login', accessToken); // login to socket
			});
		}
		return () => {
			if (authUser) {
				window.socket.off('connect');
				window.socket.disconnect(); // disconnect to socket
				console.log('disconnected to socket');
			}
		};
	}, [authUser?._id]);

	const AppContainer = (props: React.ComponentProps<typeof App>) => {
		const { token } = theme.useToken();

		return <App style={{ backgroundColor: token.colorBgLayout }} {...props} />;
	};

	return (
		<ConfigProvider
			locale={viVn}
			theme={{
				token: {},
				algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
			}}
			input={{ autoComplete: 'off' }}
			select={{ showSearch: true }}
		>
			<Toaster position="bottom-right" />

			<NextProgress color={token.colorPrimary} delay={300} height={2} />

			<AppContainer>
				<Component {...pageProps} />
			</AppContainer>

			<Analytics />
		</ConfigProvider>
	);
}
