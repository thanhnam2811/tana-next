import { Button, Card, Form, Input, Radio, Typography, theme } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { registerApi } from '../api';
import { IRegisterParams } from '../types';

export function RegisterForm() {
	const router = useRouter();
	const { token } = theme.useToken();
	const [form] = Form.useForm<IRegisterParams>();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: IRegisterParams) => {
		setLoading(true);

		const toastId = toast.loading('Đang đăng ký...');
		try {
			await registerApi(values);

			toast.success('Đăng ký thành công! Đang chuyển hướng...', { id: toastId });

			router.push('/auth/login');
		} catch (error) {
			toast.error(`Đăng ký thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Đăng ký
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Form layout="vertical" form={form} onFinish={onFinish}>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập email!',
						},
						{
							type: 'email',
							message: 'Email không hợp lệ!',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Họ và tên"
					name="fullname"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập họ và tên!',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Giới tính"
					name="gender"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập giới tính!',
						},
					]}
				>
					<Radio.Group>
						<Radio value={{ value: 'male' }}>Nam</Radio>
						<Radio value={{ value: 'female' }}>Nữ</Radio>
						<Radio value={{ value: 'other' }}>Khác</Radio>
					</Radio.Group>
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

				<Button type="primary" htmlType="submit" loading={loading} style={{ float: 'right' }}>
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
