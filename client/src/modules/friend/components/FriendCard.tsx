import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { Button, Card, Dropdown, MenuProps, Popconfirm, theme, Tooltip, Typography } from 'antd';
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
import Link from 'next/link';
import { useAuth } from '@modules/auth/hooks';
import { useReport } from '@modules/report/hooks';
import { useUserAction } from '@modules/user/hooks';

interface Props {
	user: UserType;
}

export function FriendCard({ user }: Props) {
	const { token } = theme.useToken();

	const { authUser } = useAuth();
	const isAuthUser = authUser?._id === user._id;

	const router = useRouter();
	const type = (router.query.type as FriendType) || 'friends';
	const _relationship = user.relationship || friendRelationshipMap[type] || 'none';
	const {
		relationship,
		loading,
		handleRequestFriend,
		handleCancelRequestFriend,
		handleAcceptFriend,
		handleUnfriend,
		handleChat,
		handleRejectFriend,
	} = useUserAction({ ...user, relationship: _relationship });

	const { openReport } = useReport({ type: 'user', id: user._id });
	const dropdownItems: MenuProps['items'] = [
		{
			key: 'report',
			icon: <HiExclamationTriangle />,
			label: 'Báo cáo',
			onClick: openReport,
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
						loading={Object.keys(loading).some((item) => item !== 'chat' && loading[item])} // loading doesn't include chat
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
