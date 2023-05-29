import { ListComment } from '@components/v2/List';
import { useInfiniteFetcher } from '@hooks';
import { IComment, IPost } from '@interfaces';
import React from 'react';

interface Props {
	post: IPost;
}

export function PostComment({ post }: Props) {
	const fetcher = useInfiniteFetcher<IComment>(`/posts/${post._id}/comments`);
	return (
		<div style={{ padding: '0 16px' }}>
			<ListComment fetcher={fetcher} post={post} />
		</div>
	);
}
