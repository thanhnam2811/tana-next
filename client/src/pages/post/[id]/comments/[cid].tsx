import { getPostApi } from '@modules/post/api';
import PostPage, { PostSEO } from '@modules/post/pages/PostPage';
import { GetServerSideProps } from 'next';
import { ApiError, handleError } from '@common/api';
import { PostType } from '@modules/post/types';

interface Props {
	post?: PostType;
	id?: string;
	error?: ApiError;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	const id = params?.id as string;
	const props: Props = { id };
	try {
		props.post = await getPostApi(id, true);
	} catch (e: any) {
		if (ApiError.isApiError(e)) props.error = e;
		else handleError(e).catch((e) => (props.error = e));
	}

	return { props };
};

export default function Post({ post, id, error }: Props) {
	return (
		<>
			<PostSEO id={id} post={post} error={error} />

			<PostPage post={post} />
		</>
	);
}
