import { ListComment } from '@modules/comment/components';
import { Card, Col, Row, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { PostCard, PostSEO } from '../components';
import { PostType } from '../types';
import Layout from '@layout/components';
import useSWR from 'swr';
import { swrFetcher } from '@common/api';

interface Props {
	post?: PostType;
}

export default function PostPage({ post: serverPost }: Props) {
	const router = useRouter();
	const { id } = router.query as { id: string };

	const { data, isLoading } = useSWR<PostType>(`/posts/${id}`, swrFetcher);
	const post = data || serverPost;

	if (!post) {
		if (!isLoading)
			return (
				<Layout.Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Spin size="large" />
				</Layout.Container>
			);
		else
			return (
				<Layout.Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Typography.Text strong>Bài viết không tồn tại, hoặc đã bị xóa</Typography.Text>
				</Layout.Container>
			);
	}

	const handleDelete = () => router.push('/'); // Go to home page after deleting

	return (
		<>
			<PostSEO id={id} post={post} />

			<Layout.Container>
				<Row gutter={[16, 16]} style={{ padding: 16, width: '100%' }}>
					{/* Post */}
					<Col span={16}>
						<PostCard post={post} onDelete={handleDelete} />
					</Col>

					{/* Comment */}
					<Col span={8}>
						<Card title="Bình luận" headStyle={{ padding: 16 }} bodyStyle={{ padding: 16 }}>
							<ListComment post={post!} />
						</Card>
					</Col>
				</Row>
			</Layout.Container>
		</>
	);
}
