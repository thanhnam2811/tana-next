import { ListComment } from '@components/v2/List/ListComment';
import { useInfiniteFetcher } from '@hooks';
import { IComment, IPost } from '@interfaces';
import React from 'react';

interface Props {
	post: IPost;
	comment: IComment;
}

export function CommentReply({ post, comment }: Props) {
	const replyFetcher = useInfiniteFetcher(`posts/${post._id}/comments/${comment._id}/replies`);
	return (
		<div style={{ padding: '16px 16px 0' }}>
			<ListComment fetcher={replyFetcher} post={post} comment={comment} />
		</div>
	);
}
