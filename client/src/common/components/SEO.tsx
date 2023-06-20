import React from 'react';
import Head from 'next/head';
import { urlUtil } from '@common/utils';

interface SEOImage {
	url: string;
	width?: number;
	height?: number;
	alt?: string;
}

interface Props {
	title?: string;
	description?: string;
	images?: SEOImage[];
	url?: string;
	children?: React.ReactNode;
	robot?:
		| {
				index: boolean;
				follow: boolean;
		  }
		| boolean;
}

export default function SEO({ title, description, images, url, children, robot }: Props) {
	// Default values
	title ??= 'TaNa - Kết nối và sáng tạo';
	description ??= 'Sáng tạo và kết nối cùng TaNa - Nơi gặp gỡ những tài năng đầy tiềm năng!';
	images ??= [{ url: urlUtil.getFullUrl('/seo.png'), alt: 'TaNa - Kết nối và sáng tạo', width: 1865, height: 937 }];
	url ??= 'https://www.tana.social';

	return (
		<Head>
			{/* Favicon */}
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
			<meta name="apple-mobile-web-app-title" content="TaNa" />
			<meta name="application-name" content="TaNa" />
			<meta name="msapplication-TileColor" content="#ffffff" />
			<meta name="theme-color" content="#ffffff" />

			{/* General tags */}
			<title>{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />

			{/* Robots */}
			{robot ? (
				robot === true ? (
					<meta name="robots" content="index, follow" />
				) : (
					<meta
						name="robots"
						content={`${robot.index ? 'index' : 'noindex'}, ${robot.follow ? 'follow' : 'nofollow'}`}
					/>
				)
			) : (
				<meta name="robots" content="noindex, nofollow" />
			)}

			{/* OpenGraph tags */}
			<meta property="og:title" content={title} key="ogtitle" />
			<meta property="og:description" content={description} key="ogdesc" />
			{images.map(({ url, alt, width, height }, index) => (
				<>
					<meta property="og:image" content={url} key={`ogimage${index}`} />
					{alt && <meta property="og:image:alt" content={alt} key={`ogimagealt${index}`} />}
					{width && (
						<meta property="og:image:width" content={width.toString()} key={`ogimagewidth${index}`} />
					)}
					{height && (
						<meta property="og:image:height" content={height.toString()} key={`ogimageheight${index}`} />
					)}
				</>
			))}
			<meta property="og:url" content={url} key="ogurl" />
			<meta property="og:site_name" content="TaNa - Kết nối và sáng tạo" key="ogsitename" />
			<meta property="og:type" content="website" key="ogtype" />
			<meta property="og:locale" content="vi_VN" key="oglocale" />

			{/* Twitter Card tags */}
			<meta name="twitter:card" content={description} key="twcard" />
			<meta name="twitter:creator" content="@tana" key="twhandle" />
			<meta name="twitter:title" content={title} key="twtitle" />
			<meta name="twitter:description" content={description} key="twdesc" />
			{images.map(({ url, alt, width, height }, index) => (
				<>
					<meta name="twitter:image" content={url} key={`twimage${index}`} />
					{alt && <meta name="twitter:image:alt" content={alt} key={`twimagealt${index}`} />}
					{width && (
						<meta name="twitter:image:width" content={width.toString()} key={`twimagewidth${index}`} />
					)}
					{height && (
						<meta name="twitter:image:height" content={height.toString()} key={`twimageheight${index}`} />
					)}
				</>
			))}

			{children}
		</Head>
	);
}
