import { Avatar, AvatarProps, Badge, BadgeProps, Skeleton, theme } from 'antd';
import { HiUser } from 'react-icons/hi2';
import styles from './UserAvatar.module.scss';
import { UserType } from '@modules/user/types';

interface Props {
	user?: UserType;
	badgeProps?: BadgeProps;
	avtSize?: number; // Size of avatar
}

export function UserAvatar({ user, badgeProps, avtSize = 40, ...avatarProps }: Props & AvatarProps) {
	const { token } = theme.useToken();

	const badgeSize = avtSize / 4;

	if (!user) return <Skeleton.Avatar size={avtSize} shape="circle" active />;

	return (
		<Badge
			className={styles.badge}
			count={
				user?.isOnline ? (
					<div
						className={styles.online}
						style={{
							background: token.colorSuccess,
							width: badgeSize,
							height: badgeSize,
						}}
					/>
				) : null
			}
			dot={false}
			offset={[0 - badgeSize / 2, avtSize - badgeSize / 2]}
			{...badgeProps}
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
