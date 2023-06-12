import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { ConversationType } from '../types';
import { useAuth } from '@modules/auth/hooks';
import { getConversationInfo } from '../utils';
import { theme } from 'antd';

interface Props {
	conversation: ConversationType;
	size?: number;
}

type Axis = {
	x: number;
	y: number;
};

const MAX_AVATAR = 5;
const DF_SIZE = 80;

export function ConversationAvatar({ conversation, size = DF_SIZE }: Props) {
	const { token } = theme.useToken();
	const { authUser } = useAuth();
	const { members, avatar } = conversation;
	const { isDirect, receiver } = getConversationInfo(conversation, authUser!);

	if (isDirect) {
		return <UserAvatar user={receiver?.user} avtSize={size} />;
	}

	if (avatar) {
		// Fake user
		const convUser: UserType = {
			_id: conversation._id,
			createdAt: conversation.createdAt,
			updatedAt: conversation.updatedAt,

			fullname: conversation.name,
			email: '',
			isOnline: false,

			profilePicture: avatar,
			coverPicture: avatar,

			contact: [],
			work: [],
			education: [],
		};
		return <UserAvatar user={convUser} avtSize={size} />;
	}

	let data = members.map(({ user }) => user).filter((user) => !!user?.profilePicture?.link);

	const avatarSize = (size * 2) / 3 - (size * data.length) / 16;

	if (data.length > MAX_AVATAR) data = data.slice(0, MAX_AVATAR);

	const rad = 360 / data.length;
	const unit = size / 2;
	const axisArr: Axis[] = data.map((_, index) => {
		const radian = (index * rad * Math.PI) / 180 + (Math.PI * (90 - rad / 2)) / 180;
		const x = (Math.cos(radian) * unit) / 2;
		const y = (Math.sin(radian) * unit) / 2;
		return { x, y };
	});

	// Show avatars in a circle box, avatar size is 40px
	return (
		<div
			style={{
				position: 'relative',
				width: size,
				height: size,
				borderRadius: '50%',
				border: '1px solid',
				borderColor: token.colorBorder,
				overflow: 'hidden',
			}}
		>
			{data.map((user, index) => (
				<div
					key={user._id}
					style={{
						position: 'absolute',
						top: unit - avatarSize / 2,
						left: unit - avatarSize / 2,
						transform: `translate(${axisArr[index].x}px, ${axisArr[index].y}px)`,
						transformOrigin: 'center',
						width: avatarSize,
						height: avatarSize,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<UserAvatar user={user} avtSize={avatarSize} />
				</div>
			))}
		</div>
	);
}
