import { ListComment } from '@components/v2/List/ListComment';
import { useInfiniteFetcherSWR } from '@hooks';
import { IComment, IPost } from '@interfaces';

interface Props {
	post: IPost;
	comment: IComment;
}

export function CommentReply({ post, comment }: Props) {
	const replyFetcher = useInfiniteFetcherSWR({ api: `posts/${post._id}/comments/${comment._id}/replies` });
	return (
		<div style={{ padding: '0 16px 16px' }}>
			<ListComment fetcher={replyFetcher} post={post} comment={comment} />
		</div>
	);
}
