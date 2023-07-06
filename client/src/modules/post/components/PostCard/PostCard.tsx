import { PrivacyDropdown } from 'src/common/components/Button';
import { UserAvatar } from '@modules/user/components';
import { ReactPopover, SharePopover } from 'src/common/components/Popover';
import { IPrivacy } from '@common/types';
import { ReactionTypeValue } from '@common/types/common';
import { useAuth } from '@modules/auth/hooks';
import { App, Avatar, Button, Card, Dropdown, MenuProps, Skeleton, Space, Typography } from 'antd';
import Link from 'next/link';
import { HiArchive, HiBell, HiDotsHorizontal, HiEyeOff, HiLink } from 'react-icons/hi';
import {
	HiExclamationTriangle,
	HiOutlineArrowTopRightOnSquare,
	HiOutlineChatBubbleLeft,
	HiOutlineHandThumbUp,
	HiOutlineShare,
	HiPencil,
	HiTrash,
} from 'react-icons/hi2';
import styles from './PostCard.module.scss';
import { PostContent } from './PostContent';
import { PostMedia } from './PostMedia';
import { deletePostApi, reactToPostApi, updatePostApi } from '@modules/post/api';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { dateUtil, randomUtil, urlUtil } from '@common/utils';
import { useReport } from '@modules/report/hooks';
import { PostType } from '@modules/post/types';

const { Meta } = Card;

interface Props {
	post?: PostType;
	onUpdate?: (postId: string, data: PostType) => void;
	onDelete?: (postId: string) => void;
	onCommentClick?: () => void;
	openNewTab?: boolean;
}

export function PostCard({ post: initPost, onUpdate, onDelete, onCommentClick, openNewTab }: Props) {
	const { modal } = App.useApp();

	const [post, setPost] = useState<PostType | undefined>(initPost);
	const link = urlUtil.getFullUrl(`/post/${post?._id}`);

	useEffect(() => {
		setPost(initPost);
	}, [initPost]);

	const loading = !post;
	const { authUser } = useAuth();

	const { openReport } = useReport({ type: 'post', id: post?._id });
	const menuProps: MenuProps = {
		items: [
			{
				key: 'archive',
				icon: <HiArchive />,
				label: 'Lưu bài viết',
				disabled: true,
			},
			{
				key: 'subscribe',
				icon: <HiBell />,
				label: 'Theo dõi bài viết',
				disabled: true,
			},
			{
				key: 'hide',
				icon: <HiEyeOff />,
				label: 'Ẩn bài viết',
				disabled: true,
			},
			{
				key: 'copy',
				icon: <HiLink />,
				label: 'Sao chép liên kết',
				onClick: async () => {
					await navigator.clipboard.writeText(link);
					toast.success('Đã sao chép liên kết');
				},
			},
			{
				key: 'report',
				icon: <HiExclamationTriangle />,
				label: 'Báo cáo bài viết',
				onClick: openReport,
			},
		],
	};

	if (loading)
		return (
			<Card>
				<Skeleton active avatar paragraph={{ rows: randomUtil.number(1, 4) }} />
			</Card>
		);

	const isAuthor = authUser?._id === post!.author._id;
	const author = isAuthor ? authUser! : post!.author;

	// React to the post
	const handleReact = async (react: ReactionTypeValue) => {
		try {
			const reacted = await reactToPostApi(post!._id, react);

			onUpdate?.(post!._id, reacted);

			setPost(reacted);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// Change privacy of the post
	const handlePrivacyChange = async (privacy: IPrivacy) => {
		try {
			const updated = await updatePostApi(post!._id, { privacy });

			onUpdate?.(post!._id, updated);

			setPost(updated);

			toast.success('Đã thay đổi quyền riêng tư của bài viết');
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	// Delete the post
	const handleDelete = async () => {
		try {
			await deletePostApi(post!._id);

			onDelete?.(post!._id);

			toast.success('Đã xóa bài viết');
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	if (isAuthor)
		menuProps.items!.push(
			{
				key: 'edit',
				icon: <HiPencil />,
				label: 'Chỉnh sửa bài viết',
				disabled: true,
			},
			{
				key: 'delete',
				icon: <HiTrash />,
				label: 'Xóa bài viết',
				onClick: () =>
					modal.confirm({
						title: 'Xóa bài viết',
						content: 'Bạn có chắc muốn xóa bài viết này?',
						onOk: handleDelete,
					}),
			}
		);

	const statistics = [];

	if (post!.numberReact > 0)
		statistics.push(
			<Typography.Text>
				<strong>{post!.numberReact}</strong> lượt thích
			</Typography.Text>
		);
	if (post!.numberComment > 0)
		statistics.push(
			<Typography.Text>
				<strong>{post!.numberComment}</strong> bình luận
			</Typography.Text>
		);
	if (post!.numberShare > 0)
		statistics.push(
			<Typography.Text>
				<strong>{post!.numberShare}</strong> lượt chia sẻ
			</Typography.Text>
		);

	return (
		<Card
			style={{ width: '100%' }}
			headStyle={{ padding: '0 16px' }}
			bodyStyle={{ padding: '8px 16px' }}
			bordered={false}
			extra={
				<Space>
					{openNewTab && (
						<Link href={`/post/${post!._id}`} target="_blank" rel="noopener noreferrer" passHref>
							<Button type="text" icon={<HiOutlineArrowTopRightOnSquare />} />
						</Link>
					)}

					{authUser && (
						<PrivacyDropdown value={post!.privacy} disabled={!isAuthor} onChange={handlePrivacyChange} />
					)}

					<Dropdown menu={menuProps} arrow trigger={['click']}>
						<Button type="text" icon={<HiDotsHorizontal />} />
					</Dropdown>
				</Space>
			}
			actions={[
				<ReactPopover
					key="reaction"
					reaction={post!.reactOfUser}
					onReact={handleReact}
					trigger={authUser ? 'click' : []} // Disable trigger if user is not logged in
					renderChildren={({ reaction, loading }) => (
						<Button
							icon={reaction ? <Avatar src={reaction?.img} /> : <HiOutlineHandThumbUp />}
							type="text"
							disabled={!authUser} // Disable if user is not logged in
							loading={loading}
						>
							{reaction?.label || 'Thích'}
						</Button>
					)}
				/>,
				<Button
					key="comment"
					icon={<HiOutlineChatBubbleLeft />}
					type="text"
					onClick={onCommentClick}
					disabled={!authUser} // Disable if user is not logged in
				>
					Bình luận
				</Button>,
				<SharePopover link={link} key="share">
					<Button icon={<HiOutlineShare />} type="text">
						Chia sẻ
					</Button>
				</SharePopover>,
			]}
			title={
				<Meta
					avatar={<UserAvatar user={author} avtSize={48} />}
					title={author.fullname}
					description={<span className="time-ago">{dateUtil.getTimeAgo(post!.createdAt)}</span>}
					className={styles.meta}
				/>
			}
		>
			<PostContent post={post!} />

			<PostMedia media={post!.media} />

			{statistics.length > 0 && (
				<Space style={{ marginTop: 8 }}>{statistics.map((statistic) => statistic)}</Space>
			)}
		</Card>
	);
}
