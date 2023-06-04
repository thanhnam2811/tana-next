import { ListComment } from '@modules/comment/components';
import { Card, Col, Row } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getPostApi } from '../api';
import { PostCard } from '../components';
import { PostType } from '../types';
import Head from 'next/head';

interface Props {
	post?: PostType;
}

export default function PostPage({ post: serverPost }: Props) {
	const router = useRouter();

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

		if (!post) {
			fetchPost();
		}
	}, [post, router.query.id]);

	const handleDelete = () => {
		router.push('/'); // Go to home page after deleting
	};

	return (
		<>
			<Head>
				{post?.media.map((media, index) => (
					<meta key={index} property="og:image" content={media.link} />
				))}

				<meta property="og:title" content={post?.content} />
				<meta property="og:description" content={post?.content} />
				{post?.media.map((media, index) => (
					<meta key={index} property="og:image" content={media.link} />
				))}
			</Head>

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
		</>
	);
}
