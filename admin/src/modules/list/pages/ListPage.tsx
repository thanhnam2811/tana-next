import { PageTableBase } from '@common/components/PageTableBase';
import { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { ListType } from '@modules/list/types';
import { Tag } from 'antd';

const columns: ColumnType<ListType>[] = [
	{
		key: 'key',
		title: 'Key',
		dataIndex: 'key',
	},
	{
		key: 'name',
		title: 'Tên danh sách',
		dataIndex: 'name',
	},
	{
		key: 'length',
		title: 'Số lượng',
		dataIndex: 'items',
		render: (items: ListType['items']) => items.length,
	},
	{
		key: 'isPrivate',
		title: 'Bảo mật',
		dataIndex: 'isPrivate',
		render: (isPrivate: ListType['isPrivate']) => (
			<Tag color={isPrivate ? 'red' : 'green'}>{isPrivate ? 'Riêng tư' : 'Công khai'}</Tag>
		),
	},
];

export default function ListPage() {
	const navigate = useNavigate();

	return (
		<PageTableBase<ListType>
			header="Quản lý danh sách"
			endpoint="/list"
			columns={columns}
			onRow={(record) => ({
				style: { cursor: 'pointer' },
				onClick: () => navigate(`/list/${record._id}`),
			})}
		/>
	);
}
