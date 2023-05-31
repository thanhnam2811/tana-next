import { InfinitFetcherType } from '@hooks';
import { CommentFormType, CommentType, PostType, ReactionType } from '@interfaces';
import { Collapse } from '@mui/material';
import { useUserStore } from '@store';
import { commentApi } from '@utils/api';
import { Button, Form, Input, List, Space } from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { TransitionGroup } from 'react-transition-group';
import { CommentItem } from './CommentItem';

interface Props {
	fetcher: InfinitFetcherType<CommentType>;
	post: PostType;
	comment?: CommentType;
}

export function ListComment({ fetcher, post, comment }: Props) {
	const isReply = !!comment;

	const handleDelete = async (commentId: string) => {
		try {
			await commentApi.deleteComment(post._id, commentId);
			fetcher.removeData(commentId);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	const { user } = useUserStore();

	const [form] = Form.useForm<CommentFormType>();
	const [submitting, setSubmitting] = useState(false);
	const commentInputRef = useRef<TextAreaRef>(null);

	const onSubmit = async (data: CommentFormType) => {
		setSubmitting(true);
		try {
			const res = isReply
				? await commentApi.replyComment(post._id, comment._id, data)
				: await commentApi.createComment(post._id, data);
			form.resetFields();
			fetcher.addData(res.data);

			toast.success('Bình luận thành công');

			setTimeout(() => {
				commentInputRef.current?.focus();
			}, 0); // focus after render
		} catch (error: any) {
			toast.error(error.toString());
		}
		setSubmitting(false);
	};

	// React to the post
	const handleReact = async (commentId: string, react: ReactionType) => {
		try {
			const res = await commentApi.reactToComment(post._id, commentId, react);

			fetcher.updateData(commentId, res.data);
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
							<Button onClick={fetcher.loadMore}>Xem thêm</Button>
						</div>
					)
				}
			>
				<TransitionGroup component={null}>
					{fetcher.data.map((comment) => (
						<Collapse key={comment._id}>
							<CommentItem
								comment={comment}
								post={post}
								onReact={handleReact}
								onDelete={handleDelete}
								isReply={isReply}
							/>
						</Collapse>
					))}
				</TransitionGroup>

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
						disabled={!user || submitting}
						ref={commentInputRef}
					/>
				</Form.Item>

				<Button type="primary" htmlType="submit" loading={submitting} disabled={!user}>
					{isReply ? 'Trả lời' : 'Bình luận'}
				</Button>
			</Form>
		</Space>
	);
}
