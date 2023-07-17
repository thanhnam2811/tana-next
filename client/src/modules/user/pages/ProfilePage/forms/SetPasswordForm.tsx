import React, { useState } from 'react';
import { Alert, Button, Card, Form, Input } from 'antd';
import { ISetPasswordParams } from '@modules/auth/types';
import { toast } from 'react-hot-toast';
import { sendOtpSetPasswordApi, setPasswordApi } from '@modules/auth/api';
import { CountdownButton } from '@common/components/Button';
import { useAuth } from '@modules/auth/hooks';

export function SetPasswordForm() {
	const [form] = Form.useForm<ISetPasswordParams>();
	const { setAuthUser, authUser } = useAuth();

	const onFinish = async (values: ISetPasswordParams) => {
		const toastId = toast.loading('Đang xử lý...');
		try {
			await setPasswordApi(values);

			form.resetFields();

			toast.success('Đặt mật khẩu thành công! Vui lòng kiểm tra email để xác nhận yêu cầu.', { id: toastId });

			setAuthUser({ ...authUser!, shouldSetPassword: false });
		} catch (error: any) {
			toast.error(`Đặt mật khẩu thất bại! Lỗi: ${error.message || error.toString()}`, { id: toastId });
		}
	};

	const [sending, setSending] = useState(false);
	const sendOtp = async () => {
		const toastId = toast.loading('Đang gửi mã xác nhận...');
		setSending(true);

		try {
			await sendOtpSetPasswordApi();
			toast.success('Gửi mã xác nhận thành công!', { id: toastId });
		} catch (error: any) {
			toast.error(`Gửi mã xác nhận thất bại! Lỗi: ${error.message || error.toString()}`, { id: toastId });
			throw error;
		}

		setSending(false);
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

					<Form.Item
						label="Mã xác nhận"
						name="otp"
						rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
					>
						<Input
							suffix={
								<CountdownButton
									type="primary"
									size="small"
									onClick={sendOtp}
									milliseconds={5 * 60 * 1000} // 5 minutes
									afterChildren="Gửi lại"
									loading={sending}
								>
									Gửi mã
								</CountdownButton>
							}
						/>
					</Form.Item>

					<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
						Đặt mật khẩu
					</Button>
				</Form>
			</Card>
		</>
	);
}
