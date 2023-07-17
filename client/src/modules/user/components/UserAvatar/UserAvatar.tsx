import { Avatar, AvatarProps, Badge, BadgeProps, Skeleton, theme, Tooltip } from 'antd';
import { HiUser } from 'react-icons/hi2';
import styles from './UserAvatar.module.scss';
import { UserType } from '@modules/user/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
	const router = useRouter();

	const { token } = theme.useToken();

	const [user, setUser] = useState<UserType | undefined>(initUser);
	const profilePic = user?.profilePicture;

	useEffect(() => {
		setUser(initUser);
	}, [initUser]);

	useEffect(() => {
		if (user)
			window.socket?.on(`online:${user?._id}`, (user: UserType) => {
				setUser(user);
			});

		return () => {
			window.socket?.off(`online:${user?._id}`);
		};
	}, [user]);

	if (!user) return <Skeleton.Avatar size={avtSize} shape="circle" active />;

	const goToProfile = () => router.push(`/profile?id=${user?._id}`);

	const badgeSize = avtSize / 4;
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
				<Avatar
					shape="circle"
					src={profilePic?.link}
					alt={user?.fullname}
					icon={<HiUser size={avtSize} />}
					{...avatarProps}
					style={{
						width: avtSize,
						height: avtSize,
						border: 'none',
						cursor: 'pointer',
						...avatarProps?.style,
					}}
					onClick={goToProfile}
				/>
			</Badge>
		</Tooltip>
	);
}
