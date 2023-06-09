import { ListComment } from '@modules/comment/components';
import { Card, Col, Row, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { PostCard } from '../components';
import { PostType } from '../types';
import Layout from '@layout/components';
import useSWR from 'swr';
import { ApiError, swrFetcher } from '@common/api';
import { dateUtil, stringUtil, urlUtil } from '@common/utils';
import SEO from '@common/components/SEO';

interface Props {
	post?: PostType;
}

export default function PostPage({ post: serverPost }: Props) {
	const router = useRouter();
	const { id } = router.query as { id: string };

	const { data, isLoading, error } = useSWR<PostType, ApiError>(`/posts/${id}`, swrFetcher, {
		shouldRetryOnError: (err) => err.code >= 500, // Retry if it's a server error
		revalidateOnFocus: false, // Don't revalidate on focus
	});
	const post = data || serverPost;

	const handleDelete = () => router.push('/'); // Go to home page after deleting

	return (
		<>
			<PostSEO id={id} post={post} error={error} />

			<Layout.Container
				style={post ? undefined : { display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				{post ? (
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
				) : isLoading ? (
					<Spin size="large" />
				) : (
					<Typography.Text strong>
						{error?.message || 'Bài viết không tồn tại, hoặc bạn không có quyền xem bài viết này'}
					</Typography.Text>
				)}
			</Layout.Container>
		</>
	);
}

interface SEOProps {
	post?: PostType;
	id?: string;
	error?: ApiError;
}

export function PostSEO({ post, id, error }: SEOProps) {
	const link = urlUtil.getFullUrl(`/post/${id}`);

	let title = 'Bạn cần đăng nhập để xem bài viết này';
	let description = 'Đây là bài viết không công khai. Để xem bài viết này, bạn cần đăng nhập.';
	if (post) {
		const author = post.author.fullname;
		title = `Bài viết của ${author}`;

		description = stringUtil.htmlToPlainText(post.content);
	} else if (error) {
		switch (error.code) {
			case 401:
				title = 'Bạn cần đăng nhập để xem bài viết này';
				description = 'Đây là bài viết không công khai. Để xem bài viết này, bạn cần đăng nhập.';
				break;
			case 403:
				title = 'Bạn không có quyền xem bài viết này';
				description = 'Bạn không có quyền xem bài viết này do chủ sở hữu bài viết đã giới hạn quyền truy cập.';
				break;
			case 404:
				title = 'Bài viết không tồn tại';
				description = 'Bài viết không tồn tại hoặc đã bị xóa.';
				break;
			default:
				title = 'Lỗi';
				description = 'Đã có lỗi xảy ra khi tải bài viết.';
				break;
		}
	}

	return (
		<SEO
			title={title}
			description={description}
			url={link}
			images={post?.media.map((media) => ({
				url: media.link,
			}))}
			robot={post?.privacy.value === 'public'}
		>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Article',
						headline: title,
						image: post?.media.map((media) => media.link),
						author: {
							'@type': 'Person',
							name: post?.author.fullname,
						},
						publisher: {
							'@type': 'Organization',
							name: 'TaNa - Kết nối và sáng tạo',
							logo: {
								'@type': 'ImageObject',
								url: '/logo.png',
							},
						},
						datePublished: dateUtil.formatDate(post?.createdAt, 'YYYY-MM-DD'),
						dateModified: dateUtil.formatDate(post?.updatedAt, 'YYYY-MM-DD'),
					}),
				}}
			/>
		</SEO>
	);
}
