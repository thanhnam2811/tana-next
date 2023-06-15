import { stringUtil, urlUtil } from '@common/utils';
import { PostType } from '@common/types';
import { getPostApi } from '@modules/post/api';
import PostPage from '@modules/post/pages/PostPage';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Props {
	post?: PostType;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	try {
		const id = params?.id as string;

		const post = await getPostApi(id, true);

		return { props: { post } };
	} catch (error) {
		console.log(error);
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				return { notFound: true };
			}
		}

		return { props: {} };
	}
};

export default function Post({ post }: Props) {
	const link = urlUtil.getFullUrl(`/post/${post?._id}`);

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
		<>
			<Head>
				<meta name="description" content={post?.content} />
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

			<PostPage post={post} />
		</>
	);
}
