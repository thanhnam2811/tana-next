import React, { useEffect, useState } from 'react';
import { ConversationFormType, ConversationType } from '../types';
import { Button, Form, Input, Modal } from 'antd';
import { SelectApi } from '@components/Input';
import { UserType } from '@modules/user/types';

interface Props {
	data?: ConversationType;
	open: boolean;
	onClose: () => void;
	onCreate?: (data: ConversationFormType) => Promise<void>;
	onUpdate?: (id: string, data: ConversationFormType) => Promise<void>;
}

export function ConversationModal({ data, open, onClose, onCreate, onUpdate }: Props) {
	const isEdit = !!data?._id; // Nếu có id thì là edit

	const [form] = Form.useForm<ConversationFormType>();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!data?._id) {
			form.resetFields();
		} else {
			// Chuyển member thành mảng id
			const members = data.members.map((mem) => mem.user._id);

			form.setFieldsValue({ ...data, members });
		}
	}, [data]);

	const onFinish = async (values: ConversationFormType) => {
		setSubmitting(true);

		if (isEdit) {
			await onUpdate?.(data!._id, values);
		} else {
			await onCreate?.(values);
		}

		setSubmitting(false);
		onClose();
	};

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa cuộc trò chuyện' : 'Tạo cuộc trò chuyện'}
			open={open}
			onCancel={onClose}
			footer={[
				<Button key="submit" type="primary" onClick={form.submit} loading={submitting}>
					{isEdit ? 'Lưu' : 'Tạo'}
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="name" label="Tên cuộc trò chuyện" rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item name="members" label="Thành viên" rules={[{ required: true }]}>
					<SelectApi<UserType>
						api="users/searchUser/friends"
						mode="multiple"
						toOption={(item) => ({ value: item._id, label: item.fullname })}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
