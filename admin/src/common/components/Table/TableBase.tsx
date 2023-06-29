import { swrFetcher } from '@common/api';
import { Button, Table, TableProps, Tooltip } from 'antd';
import { IoRefresh } from 'react-icons/io5';
import useSWR from 'swr';
import styles from './Table.module.scss';
import { IPaginationResponse } from '@common/types';
import { stringUtil } from '@common/utils';
import Icon from '@ant-design/icons';

export interface TableBaseProps<T extends object> extends TableProps<T> {
	endpoint: string;
	params?: {
		page?: number;
		size?: number;
		search?: string;
		filter?: object;
	};
	onPaginationChange?: (nextPage: number, pageSize?: number) => void;
}

export function TableBase<T extends object>({
	endpoint,
	params: { page = 1, size = 5, search = '', filter = {} } = {},
	onPaginationChange,
	...props
}: TableBaseProps<T>) {
	const swrKey = stringUtil.generateUrl(endpoint, { page: page - 1, size, key: search, filter });
	const { data, isLoading, mutate, isValidating } = useSWR<IPaginationResponse<T>>(swrKey, swrFetcher);

	return (
		<div className={styles.container}>
			<Table<T>
				rowKey="_id"
				loading={isLoading}
				dataSource={data?.items || []}
				{...props}
				pagination={{
					current: page,
					pageSize: size,
					onChange: onPaginationChange,
					total: data?.totalItems,
					position: ['bottomRight'],
					pageSizeOptions: [5, 10, 20, 50],
					showLessItems: true,
					showSizeChanger: true,
					...props?.pagination,
				}}
			/>

			<Tooltip title="Làm mới">
				<Button
					shape="circle"
					onClick={() => mutate()}
					loading={isValidating}
					icon={<Icon component={IoRefresh} />}
					className={styles.refresh}
				/>
			</Tooltip>
		</div>
	);
}
