// import { getPostApi } from '@modules/post/api';
// import { GetServerSideProps } from 'next';
// import { ApiError } from '@common/api';
// import { PostType } from '@modules/post/types';
import PostPage from '@modules/post/pages/PostPage';

// interface Props {
// 	post?: PostType;
// 	id?: string;
// 	error?: object;
// }

// export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
// 	const id = params?.id as string;
// 	const props: Props = { id };
// 	try {
// 		props.post = await getPostApi(id, true);
// 	} catch (e: any) {
// 		if (ApiError.isApiError(e)) props.error = e.toObject();
// 		else props.error = ApiError.fromError(e).toObject();
// 	}
//
// 	return { props };
// };

// export default function Post({ post, id, error }: Props) {
// 	return (
// 		<>
// 			<PostSEO id={id} post={post} error={error && ApiError.fromObject(error)} />
//
// 			<PostPage post={post} />
// 		</>
// 	);
// }

export default PostPage;
