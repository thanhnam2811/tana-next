import { ReactionType } from '@components/Popup';
import { InfinitFetcherType } from '@hooks';
import { List } from 'antd';
import { toast } from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostFormType, PostType } from '../types';
import { deletePostApi, reactToPostApi, updatePostApi } from '../api';
import { PostCard } from './PostCard';

interface Props {
	containerId?: string;
	fetcher: InfinitFetcherType<PostType>;
}

export function ListPost({ containerId, fetcher }: Props) {
	// React to the post
	const handleReact = async (postId: string, react: ReactionType) => {
		try {
			const reacted = await reactToPostApi(postId, react);

			fetcher.updateData(postId, reacted);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	const loader = [...Array(10)].map((_, i) => <PostCard key={i} />);

	const handleDelete = async (postId: string) => {
		const toastId = toast.loading('Đang xóa bài viết...');
		try {
			await deletePostApi(postId);
			fetcher.removeData(postId);

			toast.success('Xóa bài viết thành công', { id: toastId });
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// Handle edit post
	const handleEdit = async (postId: string, data: PostFormType) => {
		try {
			const updated = await updatePostApi(postId, data);

			fetcher.updateData(postId, updated);

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
			scrollableTarget={containerId}
			dataLength={fetcher.data.length}
			next={fetcher.loadMore}
			hasMore={fetcher.hasMore}
			loader={loader}
			endMessage={
				!fetcher.fetching && (
					<div className="empty-text">
						{fetcher.data.length ? 'Đã tải hết bài viết' : 'Chưa có bài viết nào'}
					</div>
				)
			}
		>
			<List
				loading={fetcher.fetching}
				dataSource={fetcher.data}
				split={false}
				renderItem={(post) => (
					<List.Item>
						<PostCard post={post} onDelete={handleDelete} onReact={handleReact} onEdit={handleEdit} />
					</List.Item>
				)}
			/>
		</InfiniteScroll>
	);
}
