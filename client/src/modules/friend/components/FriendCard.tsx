import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { App, Button, Card, Dropdown, MenuProps, theme, Tooltip, Typography } from 'antd';
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

interface Props {
	user: UserType;
	onUpdateRelationship?: (relationship: RelationshipType) => void;
}

export function FriendCard({ user, onUpdateRelationship }: Props) {
	const { token } = theme.useToken();
	const { modal } = App.useApp();

	const { authUser } = useAuth();
	const isAuthUser = authUser?._id === user._id;

	const router = useRouter();
	const type = (router.query.type as FriendType) || 'friends';
	const relationship = user.relationship || friendRelationshipMap[type] || 'none';

	const dropdownItems: MenuProps['items'] = [
		{
			key: 'report',
			icon: <HiExclamationTriangle />,
			label: 'Báo cáo',
		},
	];

	const handleUnfriend = () =>
		modal.confirm({
			title: (
				<span>
					Hủy kết bạn với <strong>{user.fullname}</strong>?
				</span>
			),
			content: (
				<span>
					Sau khi hủy kết bạn, nếu muốn kết bạn lại, bạn cần phải chờ <strong>{user.fullname}</strong> chấp
					nhận lời mời kết bạn của bạn.
				</span>
			),
			okText: 'Hủy kết bạn',
			okType: 'danger',
			cancelText: 'Thoát',
			onOk: async () => {
				await unFriendApi(user._id);
				toast.success('Hủy kết bạn thành công');
				onUpdateRelationship?.('none');
			},
		});

	const handleCancelRequest = () =>
		modal.confirm({
			title: (
				<span>
					Hủy lời mời kết bạn với <strong>{user.fullname}</strong>?
				</span>
			),
			content: (
				<span>
					Sau khi hủy lời mời kết bạn, bạn có thể gửi lại lời mời kết bạn cho <strong>{user.fullname}</strong>
					.
				</span>
			),
			okText: 'Hủy lời mời',
			okType: 'danger',
			cancelText: 'Thoát',
			onOk: async () => {
				await requestFriendApi(user._id);
				toast.success('Hủy lời mời kết bạn thành công');
				onUpdateRelationship?.('none');
			},
		});

	const handleAcceptRequest = async () => {
		await acceptFriendApi(user._id);
		toast.success('Chấp nhận lời mời kết bạn thành công');
		onUpdateRelationship?.('friend');
	};

	const handleRejectRequest = () =>
		modal.confirm({
			title: (
				<span>
					Từ chối lời mời kết bạn từ <strong>{user.fullname}</strong>?
				</span>
			),
			content: (
				<span>
					Nếu muốn kết bạn với <strong>{user.fullname}</strong> sau này, bạn cần gửi lại lời mời kết bạn.
				</span>
			),
			okText: 'Từ chối',
			okType: 'danger',
			cancelText: 'Thoát',
			onOk: async () => {
				await rejectFriendApi(user._id);
				toast.success('Từ chối lời mời kết bạn thành công');
				onUpdateRelationship?.('none');
			},
		});

	const handleSendRequest = async () => {
		await requestFriendApi(user._id);
		toast.success('Gửi lời mời kết bạn thành công');
		onUpdateRelationship?.('sent');
	};

	switch (relationship) {
		case 'friend':
			dropdownItems.unshift({
				key: 'unfriend',
				icon: <HiUserMinus />,
				label: 'Hủy kết bạn',
				danger: true,
				onClick: handleUnfriend,
			});
			break;
		case 'sent':
			dropdownItems.unshift({
				key: 'cancel',
				icon: <HiXMark />,
				label: 'Hủy lời mời',
				danger: true,
				onClick: handleCancelRequest,
			});
			break;
		case 'received':
			dropdownItems.unshift({
				key: 'decline',
				icon: <HiXMark />,
				label: 'Từ chối lời mời',
				danger: true,
				onClick: handleRejectRequest,
			});

			dropdownItems.unshift({
				key: 'accept',
				icon: <HiArrowDownOnSquareStack />,
				label: 'Chấp nhận lời mời',
				onClick: handleAcceptRequest,
			});
			break;
		case 'none':
			dropdownItems.unshift({
				key: 'add',
				icon: <HiUserPlus />,
				label: 'Kết bạn',
				onClick: handleSendRequest,
			});
			break;
	}

	const handleSendMsg = async () => {
		try {
			const created = await createConversationApi({ members: [{ user: user._id }] });
			await router.push(`/messages?id=${created._id}`);
		} catch (error) {
			toast('Có lỗi xảy ra, vui lòng thử lại sau');
		}
	};

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
					<Button icon={<HiChatBubbleOvalLeft />} onClick={handleSendMsg} disabled={isAuthUser} />
				</Tooltip>,
				<Dropdown key="more" menu={{ items: dropdownItems }} arrow disabled={isAuthUser}>
					<Button icon={<HiDotsHorizontal />} disabled={isAuthUser} />
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
