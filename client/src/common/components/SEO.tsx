import React from 'react';
import Head from 'next/head';
import { urlUtil } from '@common/utils';

interface SEOImage {
	url: string;
	width?: number;
	height?: number;
	alt?: string;
}

interface Robot {
	index: boolean;
	follow: boolean;
}

interface Props {
	title?: string;
	description?: string;
	images?: SEOImage[];
	url?: string;
	children?: React.ReactNode;
	robot?: Robot | boolean;
}

export default function SEO({
	title = 'TaNa - Kết nối và sáng tạo',
	description = 'Sáng tạo và kết nối cùng TaNa - Nơi gặp gỡ những tài năng đầy tiềm năng!',
	images = [{ url: urlUtil.getFullUrl('/seo.png'), alt: 'TaNa - Kết nối và sáng tạo', width: 1865, height: 937 }],
	url = 'https://www.tana.social',
	children,
	robot,
}: Props) {
	return (
		<>
			<Head>
				{renderFavicon()}
				{renderGeneralTags(title, description, url)}
				{renderRobotTags(robot)}
				{renderOpenGraphTags(title, description, images, url)}
				{renderTwitterTags(title, description, images)}
			</Head>

			<Head>{children}</Head>
		</>
	);
}

function renderFavicon() {
	return (
		<>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" key="apple-touch-icon" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" key="favicon-32x32" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" key="favicon-16x16" />
			<link rel="manifest" href="/site.webmanifest" key="site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" key="safari-pinned-tab" />
			<meta name="apple-mobile-web-app-title" content="TaNa" key="apple-mobile-web-app-title" />
			<meta name="application-name" content="TaNa" key="application-name" />
			<meta name="msapplication-TileColor" content="#ffffff" key="msapplication-TileColor" />
			<meta name="theme-color" content="#ffffff" key="theme-color" />
		</>
	);
}
function renderGeneralTags(title: string, description: string, url: string) {
	return (
		<>
			<title key="title">{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
			<meta name="description" content={description} key="description" />
			<link rel="canonical" href={url} key="canonical" />
		</>
	);
}

function renderRobotTags(robot?: boolean | Robot) {
	if (robot) {
		if (robot === true) {
			return <meta name="robots" content="index, follow" key="robots" />;
		}

		return (
			<meta
				name="robots"
				content={`${robot.index ? 'index' : 'noindex'}, ${robot.follow ? 'follow' : 'nofollow'}`}
				key="robots"
			/>
		);
	}

	return <meta name="robots" content="noindex, nofollow" key="robots" />;
}

function renderOpenGraphTags(title: string, description: string, images: SEOImage[], url: string) {
	return (
		<>
			<meta property="og:title" content={title} key="og-title" />
			<meta property="og:description" content={description} key="og-description" />
			{images.map(({ url, alt, width, height }, index) => (
				<>
					<meta property="og:image" content={url} key={`og-image-${index}`} />
					{alt && <meta property="og:image:alt" content={alt} key={`og-image-alt-${index}`} />}
					{width && (
						<meta property="og:image:width" content={width.toString()} key={`og-image-width-${index}`} />
					)}
					{height && (
						<meta property="og:image:height" content={height.toString()} key={`og-image-height-${index}`} />
					)}
				</>
			))}

			<meta property="og:url" content={url} key="og-url" />
			<meta property="og:site_name" content="TaNa - Kết nối và sáng tạo" key="og-site_name" />
			<meta property="og:type" content="website" key="og-type" />
			<meta property="og:locale" content="vi_VN" key="og-locale" />
		</>
	);
}

function renderTwitterTags(title: string, description: string, images: SEOImage[]) {
	return (
		<>
			<meta name="twitter:card" content={description} key="twitter-card" />
			<meta name="twitter:creator" content="@tana" key="twitter-creator" />
			<meta name="twitter:title" content={title} key="twitter-title" />
			<meta name="twitter:description" content={description} key="twitter-description" />
			{images.map(({ url, alt, width, height }, index) => (
				<>
					<meta name="twitter:image" content={url} key={`tw-image-${index}`} />
					{alt && <meta name="twitter:image:alt" content={alt} key={`tw-image-alt-${index}`} />}
					{width && (
						<meta name="twitter:image:width" content={width.toString()} key={`tw-image-width-${index}`} />
					)}
					{height && (
						<meta
							name="twitter:image:height"
							content={height.toString()}
							key={`tw-image-height-${index}`}
						/>
					)}
				</>
			))}
		</>
	);
}
