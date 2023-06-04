import { useSettingStore } from '@store';
import '@styles/global.scss';
import { SERVER_URL } from '@utils/common';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'draft-js/dist/Draft.css';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import 'swiper/css';

import { useAuth } from '@modules/auth/hooks';
import { Analytics } from '@vercel/analytics/react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
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

	return (
		<>
			<Component {...pageProps} />

			<Toaster position="bottom-right" />

			<NextProgress color="#29D" delay={300} height={2} />

			<Analytics />
		</>
	);
}
