import { FetcherType } from '@common/hooks';
import { ListComment } from '@modules/comment/components';
import { Collapse } from '@mui/material';
import { Card, List } from 'antd';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostType } from '../types';
import { PostCard } from './PostCard';

interface Props {
	containerId?: string;
	fetcher: FetcherType<PostType>;
}

export function ListPost({ containerId, fetcher }: Props) {
	const loader = [...Array(10)].map((_, i) => <PostCard key={i} />);

	const handleUpdate = async (postId: string, data: PostType) => fetcher.updateData(postId, data);
	const handleDelete = async (postId: string) => fetcher.removeData(postId);

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
					<PostItem post={post} onDelete={handleDelete} onUpdate={handleUpdate} openNewTab />
				)}
			/>
		</InfiniteScroll>
	);
}

const PostItem = (props: React.ComponentProps<typeof PostCard>) => {
	const [showComment, setShowComment] = useState(false);
	const toggleComment = () => setShowComment(!showComment);

	return (
		<List.Item>
			<Card bodyStyle={{ padding: 0 }} style={{ width: '100%' }}>
				<PostCard {...props} onCommentClick={toggleComment} />

				<Collapse in={showComment} mountOnEnter>
					<div style={{ padding: '0 16px 16px' }}>
						<ListComment post={props.post!} />
					</div>
				</Collapse>
			</Card>
		</List.Item>
	);
};
