import { ListComment } from '@components/List/ListComment';
import { useInfiniteFetcher } from '@hooks';

interface Props {
	post: any;
}

export function PostComment({ post }: Props) {
	const commentFetcher = useInfiniteFetcher(`/posts/${post._id}/comments`);
	return <ListComment fetcher={commentFetcher} post={post} />;
}
