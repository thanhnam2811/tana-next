import { ListComment } from '@components/List/ListComment';
import { useInfiniteFetcherSWR } from '@hooks';
import { CommentType } from '@interfaces';

interface Props {
	post: any;
}

export function PostComment({ post }: Props) {
	const commentFetcher = useInfiniteFetcherSWR<CommentType>({ api: `/posts/${post._id}/comments` });
	return <ListComment fetcher={commentFetcher} post={post} />;
}
