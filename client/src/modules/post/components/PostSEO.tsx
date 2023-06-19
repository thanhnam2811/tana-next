import React from 'react';
import Head from 'next/head';
import { PostType } from '@common/types';
import { stringUtil, urlUtil } from '@common/utils';

interface Props {
	post?: PostType;
	id?: string;
}

export function PostSEO({ post, id }: Props) {
	const link = urlUtil.getFullUrl(`/post/${id}`);

	let title = 'Bạn cần đăng nhập để xem bài viết này';
	let description = 'Đây là bài viết không công khai. Để xem bài viết này, bạn cần đăng nhập.';
	if (post) {
		const author = post.author.fullname;
		title = `Bài viết của ${author}`;

		const text = stringUtil.htmlToPlainText(post.content);
		description = text;
	}

	let pictureUrl = urlUtil.getFullUrl('/logo.png');
	if (post?.media[0]?.link) {
		pictureUrl = post?.media[0]?.link;
	}

	return (
		<Head>
			<meta name="description" content={description} />
			<link rel="canonical" href={`/post/${post?._id}`} />

			{/* Social media meta tags */}
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={link} />
			<meta property="og:image" content={pictureUrl} />

			{/* Title */}
			<title>{title}</title>
		</Head>
	);
}
