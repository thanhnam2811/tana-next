import { IActivity, UserType } from '@modules/user/types';
import { Button, List, Tooltip } from 'antd';
import useSWR from 'swr';
import { swrFetcher } from '@common/api';
import { useEffect, useState } from 'react';
import { IPaginationResponse } from '@common/types';
import { Link, useSearchParams } from 'react-router-dom';
import { HiEye } from 'react-icons/hi2';
import { stringUtil, timeUtil } from '@common/utils';

interface Props {
	user: UserType;
}

function HistoryTab({ user }: Props) {
	// const [pagination, setPagination] = useState({ page: 1, size: 10 });
	// const { page, size } = pagination;
	const [params, setParams] = useSearchParams();
	const page = Number(params.get('page') || 1);
	const size = Number(params.get('size') || 10);

	const changePage = (page: number) =>
		setParams((p) => {
			p.set('page', page.toString());
			return p;
		});

	const changeSize = (size: number) =>
		setParams((p) => {
			p.set('size', size.toString());
			return p;
		});

	const swrKey = stringUtil.generateUrl(`admin/activityUser/${user._id}`, { page: page - 1, size });
	const { data: res, isLoading } = useSWR<IPaginationResponse<IActivity>>(swrKey, swrFetcher);

	const [totalItems, setTotalItems] = useState(0);
	useEffect(() => {
		if (res?.totalItems) setTotalItems(res?.totalItems);
	}, [res?.totalItems]);

	return (
		<List
			dataSource={res?.items}
			loading={isLoading}
			renderItem={(item) => (
				<List.Item
					extra={
						<Tooltip key="link" title="Xem chi tiết">
							<Link to={item.link} style={{ display: 'block' }}>
								<Button type="text" icon={<HiEye />} />
							</Link>
						</Tooltip>
					}
				>
					<List.Item.Meta title={item.content} description={timeUtil.getTimeAgo(item.createdAt)} />
				</List.Item>
			)}
			pagination={{
				current: page,
				onChange: (page) => changePage(page),
				onShowSizeChange: (_, size) => changeSize(size),
				position: 'top',
				total: totalItems,
				pageSize: size,
			}}
		/>
	);
}

export default HistoryTab;
