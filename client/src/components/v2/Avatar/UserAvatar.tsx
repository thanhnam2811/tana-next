import { IUser } from '@interfaces';
import { Avatar, AvatarProps, Badge, BadgeProps } from 'antd';
import { HiUser } from 'react-icons/hi2';

interface Props {
	user: IUser;
	badgeProps?: BadgeProps;
	avtSize?: number; // Size of avatar
}

export function UserAvatar({ user, badgeProps, avtSize = 40, ...avatarProps }: Props & AvatarProps) {
	const content = user.isOnline ? ' ' : undefined;
	const badgeSize = avtSize / 4;

	return (
		<Badge
			count={content}
			color="green"
			offset={[0 - badgeSize / 2, avtSize - badgeSize / 2]}
			{...badgeProps}
			style={{ minWidth: badgeSize, height: badgeSize, ...badgeProps?.style }}
		>
			<Avatar
				shape="circle"
				src={user.profilePicture.link}
				icon={<HiUser />}
				{...avatarProps}
				style={{ width: avtSize, height: avtSize, ...avatarProps?.style }}
			/>
		</Badge>
	);
}
