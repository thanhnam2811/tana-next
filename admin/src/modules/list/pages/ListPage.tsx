import { PageTableBase, usePageTableBase } from '@common/components/PageTableBase';
import { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { ListType } from '@modules/list/types';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ListFormModal from '@modules/list/components/modals/ListFormModal.tsx';
import { createListApi } from '@modules/list/api/createList.api.ts';
import { updateListApi } from '@modules/list/api/updateList.api.ts';
import { BsPen, BsTrash } from 'react-icons/bs';
import { deleteListApi } from '@modules/list/api/deleteList.api.ts';

enum ModalType {
	LIST_FORM,
}

export default function ListPage() {
	const navigate = useNavigate();
	const { tableBase } = usePageTableBase<ListType>({ endpoint: '/list' });

	const [modal, setModal] = useState<ModalType | null>(null);
	const closeModal = () => setModal(null);

	const [list, setList] = useState<ListType>();
	const openCreateModal = () => {
		setList(undefined);
		setModal(ModalType.LIST_FORM);
	};
	const openEditModal = (list: ListType) => {
		setList(list);
		setModal(ModalType.LIST_FORM);
	};

	const handleSubmit = async (data: ListType) => {
		const isCreate = !list?._id;
		message.loading({
			content: isCreate ? 'Đang tạo danh sách...' : 'Đang cập nhật danh sách...',
			key: 'submit',
		});

		try {
			await (isCreate ? createListApi(data) : updateListApi(list?._id, data));
			await tableBase.mutate();

			message.success({
				content: isCreate ? 'Tạo danh sách thành công' : 'Cập nhật danh sách thành công',
				key: 'submit',
			});
			closeModal();
		} catch (error) {
			message.error({
				content: isCreate ? `Tạo danh sách thất bại: ${error}` : `Cập nhật danh sách thất bại: ${error}`,
				key: 'submit',
			});
		}
	};

	const handleDelete = async (list: ListType) => {
		message.loading({
			content: 'Đang xóa danh sách...',
			key: 'submit',
		});

		try {
			await deleteListApi(list._id);
			await tableBase.mutate();

			message.success({
				content: 'Xóa danh sách thành công',
				key: 'submit',
			});
		} catch (error) {
			message.error({
				content: `Xóa danh sách thất bại: ${error}`,
				key: 'submit',
			});
		}
	};

	const columns: ColumnType<ListType>[] = [
		{
			key: 'key',
			title: 'Key',
			dataIndex: 'key',
			width: 200,
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
			width: 100,
			align: 'right',
		},
		{
			key: 'isPrivate',
			title: 'Bảo mật',
			dataIndex: 'isPrivate',
			render: (isPrivate: ListType['isPrivate']) => (
				<Tag color={isPrivate ? 'red' : 'green'}>{isPrivate ? 'Riêng tư' : 'Công khai'}</Tag>
			),
			width: 100,
		},
		{
			key: 'actions',
			title: 'Hành động',
			render: (_, list) => (
				<Space onClick={(e) => e.stopPropagation()}>
					<Button
						shape="circle"
						type="text"
						icon={<Icon component={BsPen} />}
						onClick={() => openEditModal(list)}
					/>

					<Popconfirm title="Bạn có chắc chắn muốn xóa danh sách này?" onConfirm={() => handleDelete(list)}>
						<Button shape="circle" type="text" icon={<Icon component={BsTrash} />} danger />
					</Popconfirm>
				</Space>
			),
			width: 100,
		},
	];

	return (
		<>
			<ListFormModal
				open={modal === ModalType.LIST_FORM}
				onClose={closeModal}
				list={list}
				onSubmit={handleSubmit}
			/>

			<PageTableBase<ListType>
				endpoint="/list"
				header="Quản lý danh sách"
				actions={[
					<Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
						Tạo mới
					</Button>,
				]}
				columns={columns}
				onRow={(record) => ({
					style: { cursor: 'pointer' },
					onClick: () => navigate(`/list/${record._id}`),
				})}
			/>
		</>
	);
}
