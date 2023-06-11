import { SelectApi } from '@components/Input';
import { UserAvatar } from '@modules/user/components';
import { UserType } from '@modules/user/types';
import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { ConversationCreateType, ConversationFormType } from '../types';

interface Props {
	open: boolean;
	onClose: () => void;
	onCreate?: (data: ConversationCreateType) => Promise<void>;
}

export function CreateConversationModal({ open, onClose, onCreate }: Props) {
	const [form] = Form.useForm<ConversationFormType>();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		form.resetFields();
	}, [open]);

	const onFinish = async (values: ConversationFormType) => {
		setSubmitting(true);

		const apiData: ConversationCreateType = {
			name: values.name,
			members: values.members!.map((mem) => ({ user: mem })),
		};

		await onCreate?.(apiData);

		setSubmitting(false);
		onClose();
	};

	return (
		<Modal
			title="Tạo cuộc trò chuyện"
			open={open}
			onCancel={onClose}
			footer={[
				<Button key="submit" type="primary" onClick={form.submit} loading={submitting}>
					Tạo
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="name" label="Tên cuộc trò chuyện">
					<Input />
				</Form.Item>

				<Form.Item
					name="members"
					label="Thành viên"
					rules={[
						{
							required: true,
							message: 'Vui lòng chọn thành viên',
						},
					]}
				>
					<SelectApi<UserType>
						api="users/searchUser/friends"
						mode="multiple"
						toOption={(item) => ({ value: item._id, label: item.fullname })}
						renderOption={(item) => (
							<Space align="center">
								<UserAvatar user={item} avtSize={20} />

								<Typography.Text>{item.fullname}</Typography.Text>
							</Space>
						)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
