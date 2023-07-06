import { swrFetcher } from '@common/api';
import { Button, Table, TableProps, Tooltip } from 'antd';
import { IoRefresh } from 'react-icons/io5';
import useSWR from 'swr';
import styles from './Table.module.scss';
import { IData, IPaginationResponse } from '@common/types';
import { stringUtil } from '@common/utils';
import Icon from '@ant-design/icons';

export interface TableBaseProps<T extends IData> extends TableProps<T> {
	endpoint: string;
	params?: {
		page?: number;
		size?: number;
		search?: string;
		filter?: object;
	};
	onPaginationChange?: (nextPage: number, pageSize?: number) => void;
}

export const useTableBase = <T extends IData>({ endpoint, params }: TableBaseProps<T>) => {
	if (params && params.page) {
		params.page = params.page - 1;
	}

	const swrKey = stringUtil.generateUrl(endpoint, params);
	return useSWR<IPaginationResponse<T>>(swrKey, swrFetcher, {
		keepPreviousData: true,
	});
};

export function TableBase<T extends IData>({
	endpoint,
	params: { page = 1, size = 5, search = '', filter = {} } = {},
	onPaginationChange,
	...props
}: TableBaseProps<T>) {
	const { data, isLoading, mutate, isValidating } = useTableBase<T>({
		endpoint,
		params: { page, size, search, filter },
	});

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
