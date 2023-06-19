import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { IChangePasswordParams } from '@modules/auth/types';
import { toast } from 'react-hot-toast';
import { changePasswordApi } from '@modules/auth/api';

export function ChangePasswordForm() {
	const [form] = Form.useForm<IChangePasswordParams>();

	const onFinish = async (values: IChangePasswordParams) => {
		const toastId = toast.loading('Đang xử lý...');

		try {
			await changePasswordApi(values);

			toast.success('Đổi mật khẩu thành công!', { id: toastId });
		} catch (error: any) {
			toast.error(`Đặt mật khẩu thất bại! Lỗi: ${error.message || error.toString()}`, { id: toastId });
		}
	};

	return (
		<Card title="Đổi mật khẩu">
			<Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
				<Form.Item
					label="Mật khẩu cũ"
					name="oldPassword"
					rules={[
						{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' },
						{
							min: 6,
							message: 'Mật khẩu phải có ít nhất 6 ký tự!',
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="Mật khẩu mới"
					name="newPassword"
					rules={[
						{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
						{
							min: 6,
							message: 'Mật khẩu phải có ít nhất 6 ký tự!',
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="Xác nhận mật khẩu mới"
					name="confirmPassword"
					rules={[
						{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
						{
							min: 6,
							message: 'Mật khẩu phải có ít nhất 6 ký tự!',
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Đổi mật khẩu
				</Button>
			</Form>
		</Card>
	);
}
