import { useFetcher } from '@common/hooks';
import { dateUtil } from '@common/utils';
import { readAllNotificationApi } from '@modules/notification/api';
import { INotiPaginationRespone, NotificationType } from '@modules/notification/types';
import { UserAvatar } from '@modules/user/components';
import { Button, List, Popover, PopoverProps, Space, Typography } from 'antd';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './NotificationPopover.module.scss';

interface Props {
	renderChildren: (numberUnread: number) => ReactNode;
}

export function NotificationPopover({ renderChildren, ...props }: Props & PopoverProps) {
	const notiFetcher = useFetcher<NotificationType, INotiPaginationRespone>({ api: `/users/notifications` });

	const numberUnread = notiFetcher.listRes?.[0].numberUnread || 0;

	return (
		<Popover
			trigger={['click']}
			overlayClassName={styles.popover}
			title={
				<Space style={{ width: '100%' }}>
					<Typography.Text strong>Thông báo</Typography.Text>

					<Button
						type="link"
						onClick={() => {
							readAllNotificationApi();
						}}
						style={{ marginLeft: 'auto', padding: 0 }}
					>
						Đánh dấu tất cả đã đọc
					</Button>
				</Space>
			}
			content={
				<div id="notification-popover" style={{ height: 400, overflow: 'auto' }}>
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

										<Space direction="vertical" align="start" style={{ textAlign: 'left' }}>
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
						loadMore={
							<div style={{ padding: 8 }}>
								{notiFetcher.hasMore ? (
									<Button onClick={notiFetcher.loadMore} block loading={notiFetcher.fetching}>
										Xem thêm
									</Button>
								) : (
									<div style={{ textAlign: 'center' }}>
										<Typography.Text type="secondary" strong>
											Đã hết thông báo
										</Typography.Text>
									</div>
								)}
							</div>
						}
					/>
				</div>
			}
			{...props}
		>
			{renderChildren(numberUnread)}
		</Popover>
	);
}
