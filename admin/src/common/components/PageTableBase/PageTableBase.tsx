import { Button, Card, Input, Space } from 'antd';
import { TableBase, TableBaseProps } from '../Table';
import { HiOutlineFilter } from 'react-icons/hi';
import React, { useState } from 'react';

interface Props {
	header: React.ReactNode;
	endpoint: string;
}

export function PageTableBase<T extends object>({ header, endpoint, ...props }: Props & TableBaseProps<T>) {
	const [search, setSearch] = useState('');

	const handleSearch = (value: string) => setSearch(value?.trim());

	return (
		<Card
			title={header}
			extra={
				<Space>
					<Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} />

					<Button icon={<HiOutlineFilter />}>Lọc</Button>
				</Space>
			}
			bodyStyle={{ padding: 12 }}
		>
			<TableBase<T> endpoint={endpoint} search={search} {...props} />
		</Card>
	);
}
