import { urlUtil } from '@common/utils';
import { PostType } from '@interfaces';
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

	return (
		<>
			<Head>
				<meta name="description" content={post?.content} />
				<link rel="canonical" href={`/post/${post?._id}`} />

				{/* Social media meta tags */}
				<meta property="og:type" content="website" />
				<meta property="og:title" content="TaNa - Kết nối và sáng tạo" />
				<meta property="og:description" content={post?.content} />
				<meta property="og:url" content={link} />
				<meta property="og:image" content={post?.media[0]?.link} />
			</Head>

			<PostPage post={post} />
		</>
	);
}
