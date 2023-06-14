import React, { ReactNode } from 'react';
import { Button, Card, List, Popover, PopoverProps, Space, Typography } from 'antd';
import Link from 'next/link';
import { UserAvatar } from '@modules/user/components';
import { dateUtil } from '@common/utils';
import { useFetcher } from '@common/hooks';
import { INotiPaginationRespone, NotificationType } from '@modules/notification/types';
import { readAllNotificationApi } from '@modules/notification/api';

interface Props {
	renderChildren: (numberUnread: number) => ReactNode;
}

export function NotificationPopover({ renderChildren, ...props }: Props & PopoverProps) {
	const notiFetcher = useFetcher<NotificationType, INotiPaginationRespone>({ api: `/users/notifications` });

	const numberUnread = notiFetcher.listRes?.[0].numberUnread || 0;

	return (
		<Popover
			content={
				<Card
					title="Thông báo"
					extra={
						<Button type="link" onClick={readAllNotificationApi}>
							Đánh dấu tất cả là đã xem
						</Button>
					}
					style={{ width: 400 }}
					bodyStyle={{ maxHeight: 400, overflow: 'hidden auto', padding: 8 }}
					headStyle={{ padding: 16 }}
				>
					<List
						dataSource={notiFetcher.data}
						split={false}
						renderItem={(noti) => (
							<Link href={noti.link}>
								<Button
									type="text"
									style={{ height: 'auto', width: '100%', justifyContent: 'flex-start' }}
								>
									<Space align="start">
										<UserAvatar user={noti.sender} size={40} />

										<Space direction="vertical" align="start" style={{ textAlign: 'justify' }}>
											<Typography.Text strong style={{ whiteSpace: 'break-spaces' }}>
												{noti.content}
											</Typography.Text>
											<Typography.Text type="secondary">
												{dateUtil.getTimeAgo(noti.createdAt)}
											</Typography.Text>
										</Space>
									</Space>
								</Button>
							</Link>
						)}
					/>
				</Card>
			}
			{...props}
		>
			{renderChildren(numberUnread)}
		</Popover>
	);
}
