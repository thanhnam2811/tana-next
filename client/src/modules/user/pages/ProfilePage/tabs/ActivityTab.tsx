import React from 'react';
import { useFetcher } from '@common/hooks';
import { IActivity } from '@modules/user/types';
import { Button, Card, List, Popconfirm, Tooltip, Typography } from 'antd';
import { dateUtil } from '@common/utils';
import { HiEye, HiTrash } from 'react-icons/hi2';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { deleteActivityApi } from '@modules/user/api';

function ActivityTab() {
	const activityFetcher = useFetcher<IActivity>({ api: '/users/activities' });

	const handleDelete = async (id: string) => {
		const toastId = toast.loading('Đang xóa hoạt động...');

		try {
			await deleteActivityApi(id);
			activityFetcher.removeData(id);

			toast.success('Xóa hoạt động thành công!', { id: toastId });
		} catch (e) {
			toast.error(`Xóa hoạt động thất bại! ${e}`, { id: toastId });
		}
	};

	return (
		<Card>
			<List
				header={<Typography.Title level={3}>Hoạt động</Typography.Title>}
				loading={activityFetcher.fetching}
				dataSource={activityFetcher.data}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Tooltip key="link" title="Xem chi tiết">
								<Link href={item.link} style={{ display: 'block' }} passHref>
									<Button type="text" icon={<HiEye />} />
								</Link>
							</Tooltip>,
							<Tooltip key="delete" title="Xóa">
								<Popconfirm
									title="Bạn có chắc muốn xóa hoạt động này?"
									onConfirm={() => handleDelete(item._id)}
								>
									<Button danger type="text" icon={<HiTrash />} />
								</Popconfirm>
							</Tooltip>,
						]}
					>
						<List.Item.Meta title={item.content} description={dateUtil.getTimeAgo(item.createdAt)} />
					</List.Item>
				)}
				loadMore={
					!activityFetcher.fetching &&
					activityFetcher.data.length > 0 && (
						<div style={{ textAlign: 'center', marginTop: 16 }}>
							<Button
								onClick={activityFetcher.loadMore}
								loading={activityFetcher.loadingMore}
								disabled={!activityFetcher.hasMore}
							>
								{activityFetcher.hasMore ? 'Xem thêm' : 'Hết rồi'}
							</Button>
						</div>
					)
				}
			/>
		</Card>
	);
}

export default ActivityTab;
