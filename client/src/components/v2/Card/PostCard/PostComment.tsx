import { ListComment } from '@components/v2/List/ListComment';
import { useInfiniteFetcherSWR } from '@hooks';
import { CommentType, PostType } from '@interfaces';

interface Props {
	post: PostType;
}

export function PostComment({ post }: Props) {
	const fetcher = useInfiniteFetcherSWR<CommentType>({ api: `/posts/${post._id}/comments` });
	return (
		<div style={{ padding: '0 16px 16px' }}>
			<ListComment fetcher={fetcher} post={post} />
		</div>
	);
}
