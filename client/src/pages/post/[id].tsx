import { PostType } from '@interfaces';
import { withLayout } from '@layout';
import { getPostApi } from '@modules/post/api';
import PostPage from '@modules/post/pages/PostPage';
import axios from 'axios';
import { GetServerSideProps } from 'next';

interface Props {
	post?: PostType;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	try {
		const id = params?.id as string;
		console.log({ id });

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

function Post({ post }: Props) {
	return <PostPage post={post} />;
}

export default withLayout(Post);
