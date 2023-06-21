import { Button, Card, Form, Input, Radio, theme, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { IRegisterData, RegisterAccount } from '../types';

interface Props {
	data: Partial<IRegisterData>;
}

export function AccountForm({ data }: Props) {
	const { token } = theme.useToken();
	const [form] = Form.useForm<RegisterAccount>();

	useEffect(() => {
		form.setFieldsValue(data);
	}, [data]);

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Đăng ký tài khoản
				</Typography.Title>
			}
			style={{ width: 480, margin: 'auto' }}
		>
			<Form layout="vertical" form={form} name="account">
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

				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Tiếp tục
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
