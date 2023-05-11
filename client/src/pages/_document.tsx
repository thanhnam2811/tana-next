import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="vi">
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap"
				rel="stylesheet"
			/>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
			<meta name="apple-mobile-web-app-title" content="TaNa" />
			<meta name="application-name" content="TaNa" />
			<meta name="msapplication-TileColor" content="#ffffff" />
			<meta name="theme-color" content="#ffffff" />

			<Head />
			<body>
				<Main />
				<NextScript />
				<script async src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" />
			</body>
		</Html>
	);
}
