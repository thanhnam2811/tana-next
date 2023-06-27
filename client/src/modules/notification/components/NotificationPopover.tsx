import { useFetcher } from '@common/hooks';
import { useAuth } from '@modules/auth/hooks';
import { readAllNotificationApi, readNotificationApi } from '@modules/notification/api';
import { INotiPaginationRespone, NotificationType } from '@modules/notification/types';
import { App, Button, List, Popover, PopoverProps, Space, Typography } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';
import styles from './NotificationPopover.module.scss';

interface Props {
	renderChildren: (numberUnread: number) => ReactNode;
}

export function NotificationPopover({ renderChildren, ...props }: Props & PopoverProps) {
	const notiFetcher = useFetcher<NotificationType, INotiPaginationRespone>({ api: `/users/notifications` });
	const _numberUnread = notiFetcher.listRes?.[0].numberUnread || 0;
	const [numberUnread, setNumberUnread] = useState(_numberUnread);
	useEffect(() => {
		setNumberUnread(_numberUnread);
	}, [_numberUnread]);

	const handleReadNotification = (noti: NotificationType) => {
		if (noti.isRead) return;

		readNotificationApi(noti._id);
		notiFetcher.updateData(noti._id, { ...noti, isRead: true });
		setNumberUnread((prev) => prev - 1);
	};

	const handleReadAllNotification = () => {
		if (numberUnread === 0) return;

		readAllNotificationApi();
		notiFetcher.data.forEach((noti) => {
			if (!noti.isRead) {
				notiFetcher.updateData(noti._id, { ...noti, isRead: true });
				setNumberUnread((prev) => prev - 1);
			}
		});

		setNumberUnread(0);
	};

	const { authUser } = useAuth();
	const { notification } = App.useApp();
	useEffect(() => {
		if (authUser?._id) {
			window.socket.on('notification', ({ data: noti }: { data: NotificationType }) => {
				notiFetcher.addData(noti, true);
				setNumberUnread((prev) => prev + 1);

				notification.open({
					message: <NotificationItem noti={noti} onClick={() => handleReadNotification(noti)} />,
					placement: 'bottomRight',
				});
			});
		}

		return () => {
			window.socket.off('notification');
		};
	}, [authUser?._id]);

	return (
		<Popover
			trigger={['click']}
			overlayClassName={styles.popover}
			title={
				<Space style={{ width: '100%' }}>
					<Typography.Text strong>Thông báo</Typography.Text>

					<Button type="link" onClick={handleReadAllNotification} style={{ marginLeft: 'auto', padding: 0 }}>
						Đánh dấu tất cả đã đọc
					</Button>
				</Space>
			}
			content={
				<List
					style={{ height: 400, overflow: 'auto' }}
					dataSource={notiFetcher.data}
					split={false}
					renderItem={(noti) => <NotificationItem noti={noti} onClick={() => handleReadNotification(noti)} />}
					loadMore={
						!notiFetcher.fetching &&
						notiFetcher.data.length > 0 && (
							<div style={{ textAlign: 'center', marginTop: 16 }}>
								<Button
									size="small"
									onClick={notiFetcher.loadMore}
									loading={notiFetcher.loadingMore}
									disabled={!notiFetcher.hasMore}
								>
									{notiFetcher.hasMore ? 'Xem thêm' : 'Hết rồi'}
								</Button>
							</div>
						)
					}
				/>
			}
			{...props}
		>
			{renderChildren(numberUnread)}
		</Popover>
	);
}
