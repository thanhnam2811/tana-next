import { CommentCard } from '@components/Card/CommentCard';
import { UserAvatar } from '@components/MUI';
import { ReactionType } from '@components/Popup';
import { InfinitFetcherType } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Collapse, Stack, TextField } from '@mui/material';
import { useUserStore } from '@store';
import { commentApi } from '@utils/api';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { TransitionGroup } from 'react-transition-group';

interface Props {
	fetcher: InfinitFetcherType;
	post: any;
	comment?: any;
}

export const ListComment = ({ fetcher, post, comment }: Props) => {
	const isReply = !!comment;

	useEffect(() => {
		fetcher.reload();
	}, [fetcher.api]); // reload when api change

	const handleDeleteComment = async (commentId: string) => {
		try {
			await commentApi.deleteComment(post._id, commentId);
			fetcher.removeData(commentId);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	const { user } = useUserStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		clearErrors,
	} = useForm();

	const onSubmit = async (data: any) => {
		try {
			const res = isReply
				? await commentApi.replyComment(post._id, comment._id, data)
				: await commentApi.createComment(post._id, data);
			reset();
			fetcher.addData(res.data);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// React to the post
	const handleReactComment = async (commentId: string, react: ReactionType) => {
		try {
			const res = await commentApi.reactToComment(post._id, commentId, react);

			fetcher.updateData(commentId, res.data);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	return (
		<Box>
			{/*	Comment list*/}
			<TransitionGroup>
				{fetcher.data.map((comment) => (
					<Collapse key={comment._id}>
						<CommentCard
							key={comment._id}
							post={post}
							comment={comment}
							isReply={isReply}
							handleDelete={handleDeleteComment}
							handleReact={handleReactComment}
						/>
					</Collapse>
				))}
			</TransitionGroup>

			{/* Load more */}
			<LoadingButton
				sx={{
					width: '100%',
					textTransform: 'none',
					fontSize: '14px',
					color: '#757575',
					my: 1,
				}}
				onClick={fetcher.loadMore}
				loading={fetcher.fetching}
				loadingIndicator="Đang tải..."
				disabled={!fetcher.hasMore}
			>
				{fetcher.hasMore
					? 'Xem thêm'
					: fetcher.data.length
					? `Đã hiển thị tất cả ${isReply ? 'câu trả lời' : 'bình luận'}`
					: `Chưa có ${isReply ? 'câu trả lời' : 'bình luận'}`}
			</LoadingButton>

			{/*	New comment*/}
			<Stack component="form" onSubmit={handleSubmit(onSubmit)} direction="row" spacing={1} mt={2}>
				<TextField
					{...register('content', {
						required: true,
						onBlur: () => clearErrors('content'),
					})}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
							e.preventDefault();
							handleSubmit(onSubmit)();
						}
					}}
					variant="outlined"
					size="small"
					multiline
					minRows={2}
					maxRows={5}
					placeholder="Nhập nội dung bình luận..."
					fullWidth
					InputProps={{
						startAdornment: (
							<UserAvatar
								user={user!}
								size={40}
								badgeProps={{ sx: { mr: 2, alignSelf: 'flex-start' } }}
							/>
						),
						readOnly: isSubmitting,
						sx: {
							p: 1,
							fontSize: 14,
						},
					}}
					error={!!errors.content}
					helperText={errors.content && `Vui lòng nhập nội dung bình luận`}
				/>
				<Stack flex="auto" spacing={1}>
					<LoadingButton
						variant="contained"
						onClick={handleSubmit(onSubmit)}
						loading={isSubmitting}
						sx={{ textTransform: 'none', width: 'max-content' }}
						size="small"
					>
						Bình luận
					</LoadingButton>
				</Stack>
			</Stack>
		</Box>
	);
};
