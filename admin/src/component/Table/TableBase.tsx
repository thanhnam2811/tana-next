import { IPaginationResponse } from '@/types/api.type';
import { Table, TableProps, Card, CardProps, Space, Button } from 'antd';
import { useState } from 'react';
import useSWR from 'swr';
import { ReloadOutlined } from '@ant-design/icons';
import swrFetcher from '@/api/swrFetcher';

export interface TableBaseProps<T extends object> extends TableProps<T> {
	endpoint: string;
	cardProps?: CardProps;
}

export function TableBase<T extends object>({ endpoint, cardProps, ...props }: TableBaseProps<T>) {
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 5,
	});

	const swrKey = `${endpoint}?page=${pagination.current - 1}&size=${pagination.pageSize}`;
	const { data, isLoading, mutate } = useSWR<IPaginationResponse<T>>(swrKey, swrFetcher);

	return (
		<Card
			{...cardProps}
			extra={
				<Space>
					{cardProps?.extra}

					<Button type="text" shape="circle" onClick={() => mutate()} icon={<ReloadOutlined />} />
				</Space>
			}
		>
			<Table<T>
				rowKey="_id"
				pagination={{
					...pagination,
					total: data?.totalItems,
					position: ['bottomRight'],
					pageSizeOptions: [5, 10, 20, 50],
					onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
					showLessItems: true,
					showSizeChanger: true,
					...props?.pagination,
				}}
				loading={isLoading}
				dataSource={data?.items || []}
				{...props}
			/>
		</Card>
	);
}
