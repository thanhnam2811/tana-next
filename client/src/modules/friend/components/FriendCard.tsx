import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { Button, Card, Dropdown, MenuProps, Tooltip, Typography, theme } from 'antd';
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

interface Props {
	user: UserType;
	relationship?: FriendType;
}

export function FriendCard({ user }: Props) {
	const { token } = theme.useToken();

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

	switch (relationship) {
		case 'friend':
			dropdownItems.unshift({
				key: 'unfriend',
				icon: <HiUserMinus />,
				label: 'Hủy kết bạn',
				danger: true,
			});
			break;
		case 'sent':
			dropdownItems.unshift({
				key: 'cancel',
				icon: <HiXMark />,
				label: 'Hủy lời mời',
				danger: true,
			});
			break;
		case 'received':
			dropdownItems.unshift({
				key: 'accept',
				icon: <HiArrowDownOnSquareStack />,
				label: 'Chấp nhận lời mời',
			});
			break;
		case 'none':
			dropdownItems.unshift({
				key: 'add',
				icon: <HiUserPlus />,
				label: 'Kết bạn',
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
					src={user.coverPicture?.link}
					alt={user.fullname}
					style={{ objectFit: 'cover', background: token.colorBgLayout }}
				/>
			}
			actions={[
				<Tooltip key="profile" title="Trang cá nhân">
					<Button icon={<HiUser />} />
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
