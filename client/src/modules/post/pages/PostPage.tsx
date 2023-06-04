import { useAuth } from '@modules/auth/hooks';
import { ListComment } from '@modules/comment/components';
import { Card, Col, Row } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getPostApi } from '../api';
import { PostCard } from '../components';
import { PostType } from '../types';
import Layout from '@layout';

interface Props {
	post?: PostType;
}

export default function PostPage({ post: serverPost }: Props) {
	const router = useRouter();
	const { authUser } = useAuth();

	const [post, setPost] = React.useState<PostType | undefined>(serverPost);

	useEffect(() => {
		const fetchPost = async () => {
			const id = router.query.id as string;
			try {
				const post = await getPostApi(id);
				setPost(post);
			} catch (error) {
				console.log(error);
			}
		};

		if (router.isReady) {
			if (!post || authUser) {
				fetchPost();
			}
		}
	}, [router.isReady]);

	const handleDelete = () => {
		router.push('/'); // Go to home page after deleting
	};

	return (
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
	);
}
