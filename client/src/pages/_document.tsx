import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
	return (
		<Html lang="vi">
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap"
				rel="stylesheet"
			/>

			<Head />

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
