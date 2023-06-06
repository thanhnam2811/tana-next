import { Card, Input } from 'antd';
import { TableBase, TableBaseProps } from '../Table';

interface Props {
	header: React.ReactNode;
	endpoint: string;
}

export function PageTableBase<T extends object>({ header, endpoint, ...props }: Props & TableBaseProps<T>) {
	return (
		<Card title={header} extra="Lọc" bodyStyle={{ padding: 0 }}>
			<TableBase<T>
				endpoint={endpoint}
				cardProps={{
					title: <Input.Search placeholder="Tìm kiếm" enterButton />,
					bordered: false,
				}}
				{...props}
			/>
		</Card>
	);
}
