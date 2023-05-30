import { UserAvatar } from '@components/v2/Avatar';
import { UserType } from '@interfaces';
import { Card, Skeleton, Space, Typography } from 'antd';
import React from 'react';

interface Props {
	user?: UserType;
	metaProps?: React.ComponentProps<typeof Card.Meta>;
}

export function UserCard({ user, metaProps, ...props }: Props & React.ComponentProps<typeof Card>) {
	return (
		<Card {...props}>
			{!user ? (
				<Skeleton loading avatar title />
			) : (
				<Card.Meta avatar={<UserAvatar user={user!} />} title={user!.fullname} {...metaProps} />
			)}
		</Card>
	);
}

UserCard.Simple = function SimpleUserCard({ user, ...props }: Props & React.ComponentProps<typeof Card>) {
	return (
		<Card {...props}>
			{!user ? (
				<Skeleton loading avatar title />
			) : (
				// <Card.Meta avatar={<UserAvatar user={user!} />} title={user!.fullname} {...metaProps} />
				<Space align="center">
					<UserAvatar user={user!} />

					<Typography.Title level={5} style={{ margin: 0 }}>
						{user!.fullname}
					</Typography.Title>
				</Space>
			)}
		</Card>
	);
};
