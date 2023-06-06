import { UserType } from '@common/types';
import { Avatar, AvatarProps, Badge, BadgeProps, Skeleton, theme } from 'antd';
import { HiUser } from 'react-icons/hi2';

interface Props {
	user?: UserType;
	badgeProps?: BadgeProps;
	avtSize?: number; // Size of avatar
}

export function UserAvatar({ user, badgeProps, avtSize = 40, ...avatarProps }: Props & AvatarProps) {
	const { token } = theme.useToken();

	const content = user?.isOnline ? ' ' : undefined;
	const badgeSize = avtSize / 4;

	if (!user) return <Skeleton.Avatar size={avtSize} shape="circle" active />;

	return (
		<Badge
			count={content}
			offset={[0 - badgeSize / 2, avtSize - badgeSize / 2]}
			{...badgeProps}
			style={{
				minWidth: badgeSize,
				height: badgeSize,
				background: `${token.colorSuccess} !important`,
				...badgeProps?.style,
			}}
			color="green"
		>
			<Avatar
				shape="circle"
				src={user?.profilePicture.link}
				icon={<HiUser size={avtSize} />}
				{...avatarProps}
				style={{ width: avtSize, height: avtSize, border: 'none', ...avatarProps?.style }}
			/>
		</Badge>
	);
}
