import { Button, Card, Input, Space } from 'antd';
import { TableBase, TableBaseProps } from '../Table';
import { HiOutlineFilter } from 'react-icons/hi';
import React, { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Props<T extends object> extends TableBaseProps<T> {
	header: React.ReactNode;
	endpoint: string;
}

export function PageTableBase<T extends object>({ header, endpoint, ...props }: Props<T>) {
	const [params, setParams] = useSearchParams();

	const search = params.get('search') ?? '';
	const page = Number(params.get('page') ?? 1);
	const size = Number(params.get('size') ?? 5);
	const filter = params.get('filter') ?? {};

	const handleSearch = (value: string) =>
		setParams((params) => {
			params.set('search', value);
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

	return (
		<Card
			title={header}
			extra={
				<Space>
					<Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} onChange={handleChange} />

					<Button icon={<HiOutlineFilter />}>Lọc</Button>
				</Space>
			}
			bodyStyle={{ padding: 12 }}
		>
			<TableBase<T>
				endpoint={endpoint}
				params={{ page, size, search, filter }}
				onPaginationChange={handlePagination}
				{...props}
			/>
		</Card>
	);
}
