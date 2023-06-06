import { Card } from 'antd';
import { TableBase, TableBaseProps } from '../Table';

interface Props {
	header: React.ReactNode;
	endpoint: string;
}

export function PageTableBase<T extends object>({ header, endpoint, ...props }: Props & TableBaseProps<T>) {
	return (
		<Card title={header} extra="Lọc" bodyStyle={{ padding: 12 }}>
			<TableBase<T> endpoint={endpoint} {...props} />
		</Card>
	);
}
