import { ListComment } from '@components/v2/List/ListComment';
import { useInfiniteFetcherSWR } from '@hooks';
import { CommentType, PostType } from '@interfaces';

interface Props {
	post: PostType;
	comment: CommentType;
}

export function CommentReply({ post, comment }: Props) {
	const replyFetcher = useInfiniteFetcherSWR<CommentType>({
		api: `posts/${post._id}/comments/${comment._id}/replies`,
	});
	return (
		<div style={{ padding: '0 16px 16px' }}>
			<ListComment fetcher={replyFetcher} post={post} comment={comment} />
		</div>
	);
}
