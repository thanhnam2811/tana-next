import { IPaginationParams, IPaginationResponse } from '@/interface';
import { Table, TableProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';

interface Props<T> {
	fetchData: ({ page, size }: IPaginationParams) => Promise<IPaginationResponse<T>>;
}

export function BaseTable<T extends object>({ fetchData, ...props }: Props<T> & TableProps<T>) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<T[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 5,
		total: 0,
	});

	const fetchTableData = useCallback(
		async (pagination: { current: number; pageSize: number }) => {
			setLoading(true);
			try {
				const { current, pageSize } = pagination;
				const { items: data, totalItems: total } = await fetchData({ page: current - 1, size: pageSize });
				setData(data);
				setPagination({ ...pagination, total });
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
		[fetchData]
	);

	useEffect(() => {
		fetchTableData(pagination);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchTableData]);

	return (
		<Table<T>
			rowKey="_id"
			pagination={{
				...pagination,
				position: ['bottomRight'],
				pageSizeOptions: [5, 10, 20, 50],
				onChange: (page, pageSize) => fetchTableData({ current: page, pageSize }),
				showLessItems: true,
				showSizeChanger: true,
				...props?.pagination,
			}}
			loading={loading}
			dataSource={data}
			{...props}
		/>
	);
}
