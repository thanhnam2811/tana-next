import React from 'react';
import { NotificationType } from '../types';
import Link from 'next/link';
import { Badge, Button, Space, Typography } from 'antd';
import { UserAvatar } from '@modules/user/components';
import { dateUtil } from '@common/utils';

interface Props {
	noti: NotificationType;
	onClick?: () => void;
}

export default function NotificationItem({ noti, onClick }: Props) {
	return (
		<Link href={noti.link} style={{ display: 'block' }} passHref>
			<Button
				type="text"
				style={{ height: 'auto', width: '100%', justifyContent: 'flex-start' }}
				block
				onClick={onClick}
			>
				<Badge dot={!noti.isRead}>
					<Space align="start">
						<UserAvatar user={noti.sender} size={40} />

						<Space direction="vertical" align="start" style={{ textAlign: 'left' }}>
							<Typography.Text strong style={{ whiteSpace: 'break-spaces' }}>
								{noti.content}
							</Typography.Text>

							<Typography.Text type="secondary">{dateUtil.getTimeAgo(noti.createdAt)}</Typography.Text>
						</Space>
					</Space>
				</Badge>
			</Button>
		</Link>
	);
}
