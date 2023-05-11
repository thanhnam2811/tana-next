import { PostCard, PostCardSkeleton } from '@components/Card/PostCard';
import { InfinitFetcherType } from '@hooks';
import { Collapse, Typography } from '@mui/material';
import { postApi } from '@utils/api';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup } from 'react-transition-group';
import { ReactionType } from '../../Popup/ReactPopup';

interface Props {
	windowScroll?: boolean;
	fetcher: InfinitFetcherType;
}

export function ListPost({ windowScroll = false, fetcher }: Props) {
	// Reload when api change
	useEffect(() => {
		fetcher.reload();
	}, [fetcher.api]); // reload when api change

	// React to the post
	const handleReactPost = async (postId: string, react: ReactionType) => {
		try {
			const res = await postApi.reactToPost(postId, react);

			fetcher.updateData(postId, res.data);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	const loader = [...Array(10)].map((_, i) => <PostCardSkeleton key={i} />);

	return (
		<InfiniteScroll
			style={{ overflow: 'visible' }}
			scrollableTarget={windowScroll ? undefined : 'right-area'}
			dataLength={fetcher.data.length}
			next={fetcher.loadMore}
			hasMore={fetcher.hasMore}
			loader={loader}
			endMessage={
				!fetcher.fetching && (
					<Typography textAlign="center" color="text.secondary">
						{fetcher.data.length === 0 ? 'Không có bài viết nào' : 'Đã tải hết bài viết'}
					</Typography>
				)
			}
		>
			<TransitionGroup component={null}>
				{fetcher.data.map((post: any) => (
					<Collapse key={post._id} mountOnEnter>
						<PostCard post={post} handleReact={handleReactPost} />
					</Collapse>
				))}
			</TransitionGroup>
		</InfiniteScroll>
	);
}
