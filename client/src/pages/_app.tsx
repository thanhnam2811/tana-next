import { LayoutWrapper } from '@layout';
import { store } from '@redux/store';
import '@styles/global.css';
import 'draft-js/dist/Draft.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import NextProgress from 'next-progress';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Head from 'next/head';
import 'swiper/css';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import AOS from 'aos';

// Set default locale to Vietnamese
dayjs.locale('vi');

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		AOS.init({
			throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
		});
	}, []);

	return (
		<Provider store={store}>
			<Head>
				<title>TaNa - Kết nối và sáng tạo</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="/TaNa-logo.svg" />
			</Head>

			<NextProgress color="#29D" delay={300} height={2} />

			<LayoutWrapper>
				<Component {...pageProps} />
			</LayoutWrapper>
		</Provider>
	);
}
