import { Navigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { swrFetcher } from '@common/api';
import { ListFormType, ListType } from '@modules/list/types';
import { FullscreenSpin } from '@common/components/Loading';
import { Button, Card, message, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { BsPen, BsTrash } from 'react-icons/bs';
import { Key, useState } from 'react';
import { removeListItemsApi } from '@modules/list/api/removeListItems.api.ts';
import AddItemModal from '@modules/list/components/modals/AddItemModal.tsx';
import { addListItemsApi } from '@modules/list/api/addListItems.api.ts';
import ListFormModal from '@modules/list/components/modals/ListFormModal.tsx';
import { updateListApi } from '@modules/list/api/updateList.api.ts';

enum ModalType {
	EDIT_LIST = 'EDIT_LIST',
	ADD_ITEM = 'ADD_ITEM',
}

const ListDetail = () => {
	const { id } = useParams();
	const { data: list, isLoading, error, mutate } = useSWR<ListType>(`/list/${id}`, swrFetcher);

	const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

	const hasSelected = selectedRowKeys.length > 0;
	const onSelectChange = (rowKeys: Key[]) => setSelectedRowKeys(rowKeys);

	const [modal, setModal] = useState<ModalType | null>(null);
	const closeModal = () => setModal(null);
	const openEditListModal = () => setModal(ModalType.EDIT_LIST);
	const openAddItemModal = () => setModal(ModalType.ADD_ITEM);

	if (isLoading) return <FullscreenSpin />;
	if (error) return <div>{error || error.toString()}</div>;
	if (!id || !list) return <Navigate to="/404" />;

	const handleDelete = async (items: string[]) => {
		message.loading({ content: `Đang xóa ${items.length} giá trị...`, key: 'delete' });

		try {
			const removed = await removeListItemsApi(list._id, items);

			setSelectedRowKeys((prev) => prev.filter((key) => !items.includes(key as string)));
			await mutate(removed, false);

			message.success({ content: `Xóa ${items.length} giá trị thành công!`, key: 'delete' });
		} catch (error) {
			message.error({ content: `Xóa ${items.length} giá trị thất bại! ${error}`, key: 'delete' });
		}
	};

	const handleAddItems = async (items: string[]) => {
		message.loading({ content: `Đang thêm ${items.length} giá trị...`, key: 'add' });

		try {
			const added = await addListItemsApi(list._id, items);
			await mutate(added, false);

			message.success({ content: `Thêm ${items.length} giá trị thành công!`, key: 'add' });
		} catch (error) {
			message.error({ content: `Thêm ${items.length} giá trị thất bại! ${error}`, key: 'add' });
		}
	};

	const handleEditList = async (list: ListFormType) => {
		message.loading({ content: `Đang cập nhật danh sách...`, key: 'edit' });

		try {
			const updated = await updateListApi(id, list);
			await mutate(updated, false);

			message.success({ content: `Cập nhật danh sách thành công!`, key: 'edit' });
		} catch (error) {
			message.error({ content: `Cập nhật danh sách thất bại! ${error}`, key: 'edit' });
		}
	};

	return (
		<Card
			title={
				<Space direction="vertical">
					<Typography.Title level={4} style={{ margin: 0 }}>
						{list.name}
					</Typography.Title>

					<Space split>
						<Typography.Text type="secondary">ID: {list._id}</Typography.Text>

						<Typography.Text type="secondary">Key: {list.key}</Typography.Text>

						<Typography.Text type="secondary">Số lượng: {list.items.length}</Typography.Text>

						<Tag color={list.isPrivate ? 'red' : 'green'}>{list.isPrivate ? 'Riêng tư' : 'Công khai'}</Tag>
					</Space>
				</Space>
			}
			extra={
				<Space>
					{hasSelected && (
						<Popconfirm
							title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} giá trị đã chọn?`}
							onConfirm={() => handleDelete(selectedRowKeys as string[])}
						>
							<Button danger icon={<Icon component={BsTrash} />}>
								Xóa ({selectedRowKeys.length} giá trị)
							</Button>
						</Popconfirm>
					)}

					<Button icon={<Icon component={BsPen} />} onClick={openEditListModal}>
						Chỉnh sửa
					</Button>

					<Button type="primary" icon={<PlusOutlined />} onClick={openAddItemModal}>
						Thêm mới
					</Button>
				</Space>
			}
		>
			<AddItemModal open={modal === ModalType.ADD_ITEM} onClose={closeModal} onAdd={handleAddItems} />
			<ListFormModal
				open={modal === ModalType.EDIT_LIST}
				onClose={closeModal}
				onSubmit={handleEditList}
				list={list}
			/>

			<Table<{ index: number; key: string; value: string }>
				dataSource={list.items.map((item, index) => ({ index: index + 1, key: item, value: item }))}
				rowKey="key"
				rowSelection={{
					preserveSelectedRowKeys: true,
					selectedRowKeys,
					onChange: onSelectChange,
				}}
				columns={[
					{
						title: 'STT',
						dataIndex: 'index',
						width: 60,
						align: 'right',
					},
					{
						title: 'Giá trị',
						dataIndex: 'value',
					},
					{
						title: '',
						dataIndex: 'action',
						render: (_, item) => (
							<Space>
								<Popconfirm
									title="Bạn có chắc muốn xóa giá trị này?"
									onConfirm={() => handleDelete([item.key])}
									okText="Có"
									cancelText="Không"
									placement="left"
								>
									<Button shape="circle" type="text" danger icon={<Icon component={BsTrash} />} />
								</Popconfirm>
							</Space>
						),
						width: 60,
						align: 'center',
					},
				]}
			/>
		</Card>
	);
};

export default ListDetail;
