import { GithubIcon, GoogleIcon } from '@assets/icons';
import { SERVER_URL } from '@utils/common';
import { Avatar, Button, Card, Divider, Form, Input, Typography, theme } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';
import { ILoginParams } from '../types';
import { useRouter } from 'next/router';

export function LoginForm() {
	const router = useRouter();
	const { query } = router;
	const { token } = theme.useToken();
	const { login } = useAuth();
	const [form] = Form.useForm<ILoginParams>();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: ILoginParams) => {
		setLoading(true);

		const toastId = toast.loading('Đang đăng nhập...');
		try {
			await login(values);

			toast.success('Đăng nhập thành công!', { id: toastId });

			router.replace((query?.redirect as string) || '/home');
		} catch (error) {
			toast.error(`Đăng nhập thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};

	return (
		<Card
			title={
				<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
					Đăng nhập
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

				<Button type="primary" htmlType="submit" loading={loading} style={{ float: 'right' }}>
					Đăng nhập
				</Button>

				<Form.Item>
					<Link href="/auth/forgot-password">
						<Button type="link" style={{ padding: 0 }}>
							Quên mật khẩu?
						</Button>
					</Link>
				</Form.Item>

				<Divider>Hoặc</Divider>

				<Form.Item>
					<Link href={`${SERVER_URL}/auth/google`} target="_self">
						<Button icon={<Avatar src={GoogleIcon.src} />} block>
							Đăng nhập bằng Google
						</Button>
					</Link>
				</Form.Item>

				<Form.Item>
					<Link href={`${SERVER_URL}/auth/github`} target="_self">
						<Button icon={<Avatar src={GithubIcon.src} />} block>
							Đăng nhập bằng Github
						</Button>
					</Link>
				</Form.Item>

				<Form.Item style={{ textAlign: 'center' }}>
					Chưa có tài khoản?
					<Link href="/auth/register">
						<Button type="link">Đăng ký ngay!</Button>
					</Link>
				</Form.Item>
			</Form>
		</Card>
	);
}
