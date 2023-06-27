import { swrFetcher } from '@common/api';
import { Button, Table, TableProps, Tooltip } from 'antd';
import { useState } from 'react';
import { IoRefresh } from 'react-icons/io5';
import useSWR from 'swr';
import styles from './Table.module.scss';
import { IPaginationResponse } from '@common/types';

export interface TableBaseProps<T extends object> extends TableProps<T> {
	endpoint: string;
	search?: string;
}

export function TableBase<T extends object>({ endpoint, search, ...props }: TableBaseProps<T>) {
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 5,
	});

	const swrKey = `${endpoint}?page=${pagination.current - 1}&size=${pagination.pageSize}&key=${search}`;
	const { data, isLoading, mutate, isValidating } = useSWR<IPaginationResponse<T>>(swrKey, swrFetcher);

	return (
		<div className={styles.container}>
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

			<Tooltip title="Làm mới">
				<Button
					shape="circle"
					onClick={() => mutate()}
					loading={isValidating}
					icon={<IoRefresh />}
					className={styles.refresh}
				/>
			</Tooltip>
		</div>
	);
}
