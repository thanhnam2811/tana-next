import { Button, Card, Input, Space } from 'antd';
import { TableBase, TableBaseProps, useTableBase } from '../Table';
import { HiOutlineFilter } from 'react-icons/hi';
import React, { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IData } from '@common/types';

interface Props<T extends IData> extends TableBaseProps<T> {
	header: React.ReactNode;
	endpoint: string;
	actions?: React.ReactNode[];
}

export const usePageTableBase = <T extends IData>({ endpoint }: TableBaseProps<T>) => {
	const [params, setParams] = useSearchParams();

	const key = params.get('key') ?? '';
	const page = Number(params.get('page') ?? 1);
	const size = Number(params.get('size') ?? 5);
	const filter = params.get('filter') ?? {};

	const handleSearch = (value: string) =>
		setParams((params) => {
			params.set('key', value);
			params.set('page', '1');
			return params;
		});

	const typingTimeoutRef = useRef<NodeJS.Timeout>();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		typingTimeoutRef.current = setTimeout(() => {
			handleSearch(value);
		}, 800);
	};

	const handlePagination = (nextPage: number, pageSize: number = size) =>
		setParams((params) => {
			params.set('page', nextPage.toString());
			params.set('size', pageSize.toString());
			return params;
		});

	const tableBase = useTableBase({ endpoint, params: { page, size, key, filter } });

	return { key, page, size, filter, handleSearch, handleChange, handlePagination, tableBase };
};

export function PageTableBase<T extends IData>({ header, endpoint, actions, ...props }: Props<T>) {
	const { key, page, size, filter, handleSearch, handleChange, handlePagination } = usePageTableBase<T>({
		endpoint,
	});

	return (
		<Card
			title={header}
			extra={
				<Space>
					<Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} onChange={handleChange} />

					<Button icon={<HiOutlineFilter />}>Lọc</Button>

					{actions}
				</Space>
			}
			bodyStyle={{ padding: 12 }}
		>
			<TableBase<T>
				endpoint={endpoint}
				params={{ page, size, key, filter }}
				onPaginationChange={handlePagination}
				{...props}
			/>
		</Card>
	);
}
