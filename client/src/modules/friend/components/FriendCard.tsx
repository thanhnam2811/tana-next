import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { App, Button, Card, Dropdown, MenuProps, message, theme, Tooltip, Typography } from 'antd';
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
import { FriendType } from '../types';
import { acceptFriendApi, rejectFriendApi, requestFriendApi, unFriendApi } from '../api';
import Link from 'next/link';

interface Props {
	user: UserType;
	reload?: () => void;
}

export function FriendCard({ user, reload }: Props) {
	const { token } = theme.useToken();
	const { modal } = App.useApp();

	const router = useRouter();
	const type = (router.query.type as FriendType) || 'friends';
	const relationship = friendRelationshipMap[type] || user.relationship || 'none';

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
			onOk: () =>
				unFriendApi(user._id).then(() => {
					message.success('Hủy kết bạn thành công');
					reload?.();
				}),
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
			onOk: () =>
				requestFriendApi(user._id).then(() => {
					message.success('Hủy lời mời kết bạn thành công');
					reload?.();
				}),
		});

	const handleAcceptRequest = () =>
		acceptFriendApi(user._id).then(() => {
			message.success('Chấp nhận lời mời kết bạn thành công');
			reload?.();
		});

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
			onOk: () =>
				rejectFriendApi(user._id).then(() => {
					message.success('Từ chối lời mời kết bạn thành công');
					reload?.();
				}),
		});

	const handleSendRequest = () =>
		modal.confirm({
			title: (
				<span>
					Gửi lời mời kết bạn đến <strong>{user.fullname}</strong>?
				</span>
			),
			content: (
				<span>
					<strong>{user.fullname}</strong> sẽ nhận được thông báo về lời mời kết bạn của bạn.
				</span>
			),
			okText: 'Gửi lời mời',
			cancelText: 'Thoát',
			onOk: () =>
				requestFriendApi(user._id).then(() => {
					message.success('Gửi lời mời kết bạn thành công');
					reload?.();
				}),
		});

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
					<Button icon={<HiChatBubbleOvalLeft />} />
				</Tooltip>,
				<Dropdown key="more" menu={{ items: dropdownItems }} arrow>
					<Button icon={<HiDotsHorizontal />} />
				</Dropdown>,
			]}
			bodyStyle={{ padding: 12 }}
		>
			<Card.Meta
				avatar={<UserAvatar user={user} />}
				title={user.fullname}
				description={
					<Typography.Text strong type={relationshipColor[relationship]}>
						{relationshipLabel[relationship]}
					</Typography.Text>
				}
			/>
		</Card>
	);
}
