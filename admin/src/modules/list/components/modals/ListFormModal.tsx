import { Form, Input, Modal, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { ListFormType } from '@modules/list/types';

interface Props {
	open: boolean;
	onClose: () => void;
	list?: ListFormType;
	onSubmit: (data: ListFormType) => Promise<void> | void;
}

function ListFormModal({ open, onClose, list, onSubmit }: Props) {
	const [form] = Form.useForm<ListFormType>();

	useEffect(() => {
		if (list) form.setFieldsValue(list);
		else form.resetFields();
	}, [open]);

	const [submitting, setSubmitting] = useState(false);
	const onFormFinish = async (values: ListFormType) => {
		setSubmitting(true);
		await onSubmit(values);
		setSubmitting(false);
		onClose();
	};

	return (
		<Modal
			title={list ? 'Sửa danh sách' : 'Thêm danh sách'}
			open={open}
			onCancel={onClose}
			onOk={form.submit}
			okButtonProps={{ loading: submitting }}
		>
			<Form form={form} onFinish={onFormFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
				<Form.Item name="name" label="Tên danh sách">
					<Input placeholder="Nhập giá trị" />
				</Form.Item>

				<Form.Item name="key" label="Key">
					<Input placeholder="Nhập giá trị" />
				</Form.Item>

				<Form.Item name="isPrivate" label="Bảo mật">
					<Switch checkedChildren="Riêng tư" unCheckedChildren="Công khai" />
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default ListFormModal;
