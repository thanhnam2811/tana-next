import React from 'react';
import { Alert, Button, Card, Form, Input } from 'antd';
import { ISetPasswordParams } from '@modules/auth/types';
import { toast } from 'react-hot-toast';
import { setPasswordApi } from '@modules/auth/api';

export function SetPasswordForm() {
	const [form] = Form.useForm<ISetPasswordParams>();

	const onFinish = async (values: ISetPasswordParams) => {
		const toastId = toast.loading('Đang xử lý...');
		try {
			await setPasswordApi(values);

			form.resetFields();

			toast.success('Đặt mật khẩu thành công! Vui lòng kiểm tra email để xác nhận yêu cầu.', { id: toastId });
		} catch (error: any) {
			toast.error(`Đặt mật khẩu thất bại! Lỗi: ${error.message || error.toString()}`, { id: toastId });
		}
	};

	return (
		<>
			<Alert
				type="warning"
				showIcon
				message="Tài khoản của bạn chưa có mật khẩu. Vui lòng đặt mật khẩu để có thể đăng nhập bằng email và mật khẩu."
			/>

			<Card title="Đặt mật khẩu">
				<Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
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
							{
								validator: (_, value) => {
									if (value === form.getFieldValue('newPassword')) {
										return Promise.resolve();
									}

									return Promise.reject(new Error('Mật khẩu không khớp!'));
								},
							},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
						Đặt mật khẩu
					</Button>
				</Form>
			</Card>
		</>
	);
}
