import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { App, Button, Card, Dropdown, MenuProps, Popconfirm, theme, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiDotsHorizontal } from 'react-icons/hi';
import {
	HiArrowDownOnSquareStack,
	HiChatBubbleOvalLeft,
	HiExclamationTriangle,
	HiUser,
	HiUserMinus,
	HiUserPlus,
	HiXMark,
} from 'react-icons/hi2';
import { friendRelationshipMap, relationshipColor, relationshipLabel } from '../data';
import { FriendType, RelationshipType } from '../types';
import { acceptFriendApi, rejectFriendApi, requestFriendApi, unFriendApi } from '../api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createConversationApi } from '@modules/messages/api';
import { useAuth } from '@modules/auth/hooks';
import { useState } from 'react';

interface Props {
	user: UserType;
}

export function FriendCard({ user }: Props) {
	const { token } = theme.useToken();
	const { modal } = App.useApp();

	const { authUser } = useAuth();
	const isAuthUser = authUser?._id === user._id;

	const router = useRouter();
	const type = (router.query.type as FriendType) || 'friends';
	const _relationship = user.relationship || friendRelationshipMap[type] || 'none';
	const [relationship, setRelationship] = useState(_relationship);
	const [loading, setLoadingState] = useState<{ [key: string]: boolean }>({});
	const setLoading = (key: string, value: boolean) => setLoadingState((prev) => ({ ...prev, [key]: value }));

	const handleRequestFriend = async () => {
		const toastId = toast.loading('Đang gửi lời mời kết bạn...');
		setLoading('request', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Gửi lời mời kết bạn thành công!', { id: toastId });
			setRelationship('sent');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('request', false);
	};

	const handleUnfriend = async () => {
		const toastId = toast.loading('Đang hủy kết bạn...');
		setLoading('unfriend', true);

		try {
			await unFriendApi(user._id);
			toast.success('Hủy kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('unfriend', false);
	};

	const handleChat = async () => {
		const toastId = toast.loading('Đang chuyển hướng đến trang nhắn tin...');
		setLoading('chat', true);

		try {
			const created = await createConversationApi({ members: [{ user: user._id }] });
			await router.push(`/messages?id=${created._id}`);

			toast.dismiss(toastId);
		} catch (error) {
			toast('Có lỗi xảy ra, vui lòng thử lại sau', { id: toastId });
		}

		setLoading('chat', false);
	};

	const handleAcceptFriend = async () => {
		const toastId = toast.loading('Đang xác nhận lời mời kết bạn...');
		setLoading('accept', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Xác nhận lời mời kết bạn thành công! Bạn bè với nhau rồi đó!', { id: toastId });
			setRelationship('friend');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('accept', false);
	};

	const handleRejectFriend = async () => {
		const toastId = toast.loading('Đang từ chối lời mời kết bạn...');
		setLoading('reject', true);

		try {
			await requestFriendApi(user._id);
			toast.success('Từ chối lời mời kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('reject', false);
	};

	const handleCancelRequestFriend = async () => {
		const toastId = toast.loading('Đang hủy lời mời kết bạn...');
		setLoading('cancel', true);

		try {
			await requestFriendApi(user._id); // Request friend again to cancel
			toast.success('Hủy lời mời kết bạn thành công!', { id: toastId });
			setRelationship('none');
		} catch (error: any) {
			toast.error(error.message || error.toString(), { id: toastId });
		}

		setLoading('cancel', false);
	};

	const dropdownItems: MenuProps['items'] = [
		{
			key: 'report',
			icon: <HiExclamationTriangle />,
			label: 'Báo cáo',
		},
	];

	switch (relationship) {
		case 'friend':
			dropdownItems.unshift({
				key: 'unfriend',
				icon: <HiUserMinus />,
				danger: true,
				label: (
					<Popconfirm
						title="Bạn có chắc muốn hủy kết bạn?"
						okText="Hủy kết bạn"
						cancelText="Thoát"
						onConfirm={handleUnfriend}
					>
						Hủy kết bạn
					</Popconfirm>
				),
			});
			break;
		case 'sent':
			dropdownItems.unshift({
				key: 'cancel',
				icon: <HiXMark />,
				danger: true,
				label: (
					<Popconfirm
						title="Bạn có chắc muốn hủy lời mời kết bạn?"
						okText="Hủy lời mời"
						cancelText="Thoát"
						onConfirm={handleCancelRequestFriend}
					>
						Hủy lời mời
					</Popconfirm>
				),
			});
			break;
		case 'received':
			dropdownItems.unshift({
				key: 'decline',
				icon: <HiXMark />,
				danger: true,
				label: (
					<Popconfirm
						title="Bạn có chắc muốn từ chối lời mời kết bạn?"
						okText="Từ chối"
						cancelText="Thoát"
						onConfirm={handleRejectFriend}
					>
						Từ chối
					</Popconfirm>
				),
			});

			dropdownItems.unshift({
				key: 'accept',
				icon: <HiArrowDownOnSquareStack />,
				label: 'Chấp nhận lời mời',
				onClick: handleAcceptFriend,
			});
			break;
		case 'none':
			dropdownItems.unshift({
				key: 'add',
				icon: <HiUserPlus />,
				label: 'Kết bạn',
				onClick: handleRequestFriend,
			});
			break;
	}

	return (
		<Card
			hoverable
			cover={
				<Image
					width={200}
					height={100}
					src={user.coverPicture?.link || 'http://via.placeholder.com/200x100?text='}
					alt={user.fullname}
					style={{ objectFit: 'cover', background: token.colorBgLayout }}
				/>
			}
			actions={[
				<Tooltip key="profile" title="Trang cá nhân">
					<Link href={`/profile?id=${user._id}`} passHref draggable>
						<Button icon={<HiUser />} />
					</Link>
				</Tooltip>,
				<Tooltip key="message" title="Nhắn tin">
					<Button
						icon={<HiChatBubbleOvalLeft />}
						onClick={handleChat}
						disabled={isAuthUser}
						loading={loading.chat}
					/>
				</Tooltip>,
				<Dropdown key="more" menu={{ items: dropdownItems }} arrow disabled={isAuthUser} trigger={['click']}>
					<Button
						icon={<HiDotsHorizontal />}
						disabled={isAuthUser}
						loading={Object.keys(loading).some((item) => item !== 'chat' && loading[item])} // loading not include chat
					/>
				</Dropdown>,
			]}
			bodyStyle={{ padding: 12 }}
		>
			<Card.Meta
				avatar={<UserAvatar user={user} />}
				title={user.fullname}
				description={
					isAuthUser ? (
						'Bạn'
					) : (
						<Typography.Text strong type={relationshipColor[relationship]}>
							{relationshipLabel[relationship]}
						</Typography.Text>
					)
				}
			/>
		</Card>
	);
}
