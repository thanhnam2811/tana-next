import { Avatar, AvatarProps, Badge, BadgeProps, Skeleton, theme, Tooltip } from 'antd';
import { HiUser } from 'react-icons/hi2';
import styles from './UserAvatar.module.scss';
import { UserType } from '@modules/user/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
	user?: UserType;
	nickname?: string;
	badgeProps?: BadgeProps;
	avtSize?: number; // Size of avatar
}

export function UserAvatar({
	user: initUser,
	nickname,
	badgeProps,
	avtSize = 40,
	...avatarProps
}: Props & AvatarProps) {
	const { token } = theme.useToken();
	const badgeSize = avtSize / 4;

	const [user, setUser] = useState<UserType | undefined>(initUser);
	const profilePic = user?.profilePicture;

	useEffect(() => {
		setUser(initUser);
	}, [initUser]);

	useEffect(() => {
		if (user)
			window.socket?.on(`online:${user?._id}`, (user: UserType) => {
				console.log('online', user);
				setUser(user);
			});

		return () => {
			window.socket?.off(`online:${user?._id}`);
		};
	}, [user]);

	if (!user) return <Skeleton.Avatar size={avtSize} shape="circle" active />;

	return (
		<Tooltip title={nickname || user?.fullname} placement="top">
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
				<Link href={`/profile?id=${user?._id}`} passHref draggable onClick={(e) => e.stopPropagation()}>
					<Avatar
						shape="circle"
						src={profilePic?.link}
						alt={user?.fullname}
						icon={<HiUser size={avtSize} />}
						{...avatarProps}
						style={{ width: avtSize, height: avtSize, border: 'none', ...avatarProps?.style }}
					/>
				</Link>
			</Badge>
		</Tooltip>
	);
}
