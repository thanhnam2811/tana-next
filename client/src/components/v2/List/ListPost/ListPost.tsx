import { PostCard } from '@components/v2/Card/PostCard';
import { InfinitFetcherType } from '@hooks';
import { Collapse, Typography } from '@mui/material';
import { postApi } from '@utils/api';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup } from 'react-transition-group';
import { IPost } from '@interfaces';
import { ReactionType } from '@components/Popup';

interface Props {
	windowScroll?: boolean;
	fetcher: InfinitFetcherType<IPost>;
}

export function ListPost({ windowScroll = false, fetcher }: Props) {
	// Reload when api change
	useEffect(() => {
		fetcher.reload();
	}, [fetcher.api]); // reload when api change

	// React to the post
	const handleReact = async (postId: string, react: ReactionType) => {
		try {
			const res = await postApi.react(postId, react);

			fetcher.updateData(postId, res.data);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	const loader = [...Array(10)].map((_, i) => <PostCard key={i} />);

	const handleDelete = async (postId: string) => {
		const toastId = toast.loading('Đang xóa bài viết...');
		try {
			await postApi.delete(postId);
			fetcher.removeData(postId);

			toast.success('Xóa bài viết thành công', { id: toastId });
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// Handle edit post
	const handleEdit = async (postId: string, data: Partial<IPost>) => {
		try {
			const res = await postApi.update(postId, data);

			fetcher.updateData(postId, res.data);

			toast.success('Cập nhật bài viết thành công');
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	return (
		<InfiniteScroll
			style={{
				overflow: 'visible',
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
			}}
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
						<PostCard post={post} onDelete={handleDelete} onReact={handleReact} onEdit={handleEdit} />
					</Collapse>
				))}
			</TransitionGroup>
		</InfiniteScroll>
	);
}
