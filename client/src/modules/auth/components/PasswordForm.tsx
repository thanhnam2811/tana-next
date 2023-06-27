import { Button, Card, Form, Input, theme, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CountdownButton } from '@common/components/Button';
import { IRegisterData, RegisterAccount, RegisterPassword } from '@modules/auth/types';
import { toast } from 'react-hot-toast';
import { sendOtpRegisterApi } from '@modules/auth/api';

interface Props {
	data: Partial<IRegisterData>;
}

export function PasswordForm({ data }: Props) {
	const { token } = theme.useToken();
	const [form] = Form.useForm<RegisterPassword>();

	useEffect(() => {
		form.setFieldsValue(data);
	}, [data]);

	const [sending, setSending] = useState(false);
	const sendOTP = async () => {
		setSending(true);
		const toastId = toast.loading('Đang gửi mã xác nhận...');

		try {
			await sendOtpRegisterApi(data as RegisterAccount);
			toast.success('Gửi mã xác nhận thành công!', { id: toastId });
			setSending(false);
		} catch (error: any) {
			const errorText = error.message || error.toString();
			toast.error(`Gửi mã xác nhận thất bại! Lỗi: ${errorText}`, { id: toastId });
			form.setFields([{ name: 'otp', errors: [errorText] }]);
			setSending(false);
			throw error;
		}
	};

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Đăng ký tài khoản
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Form layout="vertical" form={form} name="password">
				<Form.Item
					label="Mã xác nhận"
					name="otp"
					rules={[
						{ required: true, message: 'Vui lòng nhập mã xác nhận!' },
						{
							len: 6,
							message: 'Mã xác nhận phải có 6 số!',
						},
					]}
				>
					<Input
						suffix={
							<CountdownButton
								type="primary"
								size="small"
								milliseconds={5 * 60 * 1000} // 5 minutes
								afterChildren="Gửi lại"
								onClick={sendOTP}
								loading={sending}
								state="start"
							>
								Gửi mã
							</CountdownButton>
						}
					/>
				</Form.Item>

				<Form.Item
					label="Mật khẩu"
					name="password"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập mật khẩu!',
						},
						{
							min: 6,
							message: 'Mật khẩu phải có ít nhất 6 ký tự!',
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="Nhập lại mật khẩu"
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập lại mật khẩu!',
						},
						{
							validator: (_, value) => {
								if (value === form.getFieldValue('password')) {
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
					Đăng ký
				</Button>

				<Form.Item>
					Đã có tài khoản?
					<Link href="/auth/login">
						<Button type="link">Đăng nhập ngay!</Button>
					</Link>
				</Form.Item>
			</Form>
		</Card>
	);
}
