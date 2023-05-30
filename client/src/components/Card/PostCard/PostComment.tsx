import { ListComment } from '@components/List/ListComment';
import { useInfiniteFetcherSWR } from '@hooks';

interface Props {
	post: any;
}

export function PostComment({ post }: Props) {
	const commentFetcher = useInfiniteFetcherSWR({ api: `/posts/${post._id}/comments` });
	return <ListComment fetcher={commentFetcher} post={post} />;
}
