import { PostType } from '@common/types';
import { getPostApi } from '@modules/post/api';
import PostPage from '@modules/post/pages/PostPage';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { PostSEO } from '@modules/post/components';

interface Props {
	post?: PostType;
	id?: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	const id = params?.id as string;
	const props: Props = { id };
	try {
		const post = await getPostApi(id, true);

		props.post = post;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				return { notFound: true };
			}
		}
	}

	return { props };
};

export default function Post({ post, id }: Props) {
	return (
		<>
			<PostSEO id={id} post={post} />

			<PostPage post={post} />
		</>
	);
}
