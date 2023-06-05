import { useFetcher } from '@common/hooks';
import { CommentFormType, CommentType, PostType, ReactionType } from '@common/types';
import { Button, Form, Input, List, Space } from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createCommentApi, deleteCommentApi, reactToCommentApi, replyToCommentApi } from '../api';
import { CommentItem } from './CommentItem';
import { useAuth } from '@modules/auth/hooks';

interface Props {
	post: PostType;
	comment?: CommentType;
}

export function ListComment({ post, comment }: Props) {
	const isReply = !!comment;

	const api = isReply ? `posts/${post._id}/comments/${comment?._id}/replies` : `posts/${post._id}/comments`;
	const fetcher = useFetcher<CommentType>({ api });

	const handleDelete = async (commentId: string) => {
		try {
			await deleteCommentApi(post._id, commentId);
			fetcher.removeData(commentId);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	const { authUser } = useAuth();

	const [form] = Form.useForm<CommentFormType>();
	const [submitting, setSubmitting] = useState(false);

	const inputRef = React.useRef<TextAreaRef>(null);
	const onSubmit = async (data: CommentFormType) => {
		setSubmitting(true);
		try {
			const created = isReply
				? await replyToCommentApi(post._id, comment._id, data)
				: await createCommentApi(post._id, data);
			form.resetFields();
			fetcher.addData(created);

			toast.success('Bình luận thành công!');

			setTimeout(() => {
				const el = document.getElementById(created._id);
				el?.scrollIntoView({ behavior: 'smooth' });

				inputRef.current?.focus();
			}, 0); // focus after render
		} catch (error: any) {
			toast.error(error.toString());
		}
		setSubmitting(false);
	};

	// React to the post
	const handleReact = async (commentId: string, react: ReactionType) => {
		try {
			const reacted = await reactToCommentApi(post._id, commentId, react);

			fetcher.updateData(commentId, reacted);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<List
				bordered={isReply}
				style={{
					padding: isReply ? '0 16px' : undefined,
					borderTopLeftRadius: isReply ? 0 : undefined,
					borderTopRightRadius: isReply ? 0 : undefined,
					borderTop: isReply ? 'none' : undefined,
				}}
				itemLayout="vertical"
				loading={fetcher.fetching}
				loadMore={
					fetcher.hasMore &&
					!fetcher.fetching && (
						<div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
							<Button onClick={fetcher.loadMore} loading={fetcher.fetching}>
								Xem thêm
							</Button>
						</div>
					)
				}
			>
				{fetcher.data.map((comment) => (
					<CommentItem
						key={comment._id}
						comment={comment}
						post={post}
						onReact={handleReact}
						onDelete={handleDelete}
						isReply={isReply}
					/>
				))}

				{/* Empty */}
				{!fetcher.fetching && fetcher.data.length === 0 && (
					<div className="empty-text">Chưa có bình luận nào</div>
				)}
			</List>

			<Form form={form} onFinish={onSubmit} layout="inline">
				<Form.Item
					style={{ flex: 1 }}
					name="content"
					rules={[{ required: true, message: 'Nội dung không được để trống' }]}
				>
					<Input.TextArea
						placeholder="Viết bình luận"
						autoSize={{ minRows: 2, maxRows: 4 }}
						onPressEnter={(e) => {
							e.preventDefault();
							form.submit();
						}}
						disabled={!authUser || submitting}
						ref={inputRef}
					/>
				</Form.Item>

				<Button type="primary" htmlType="submit" loading={submitting} disabled={!authUser}>
					{isReply ? 'Trả lời' : 'Bình luận'}
				</Button>
			</Form>
		</Space>
	);
}
