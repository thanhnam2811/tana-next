import { withLayout } from '@layout/components';
import { Button, Card, Col, Divider, Form, Input, Row, theme, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Lottie from 'react-lottie-player';
import { resetPasswordApi } from '../api';

const ResetPasswordPage = () => {
	const router = useRouter();
	const { id, token: rsToken } = router.query as { id: string; token: string };

	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: { password: string }) => {
		setLoading(true);

		const toastId = toast.loading('Đang đặt lại mật khẩu...');
		try {
			await resetPasswordApi({ id, token: rsToken, password: values.password });

			toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.', { id: toastId });

			await router.push('/auth/login');
		} catch (error) {
			toast.error(`Đặt lại mật khẩu thất bại! Lỗi: ${error}`, { id: toastId });
		}

		setLoading(false);
	};
	return (
		<Row style={{ maxWidth: 1200, margin: 'auto', flex: 1, height: '100%' }} align="middle" justify="center">
			<Col span={12} style={{ height: 'fit-content' }}>
				<Lottie
					path="https://assets3.lottiefiles.com/private_files/lf30_GjhcdO.json"
					speed={1}
					loop
					play
					style={{ width: '100%', height: '100%' }}
				/>
			</Col>

			<Card
				title={
					<Typography.Title level={2} style={{ color: token.colorPrimary, margin: 0, textAlign: 'center' }}>
						Đặt lại mật khẩu
					</Typography.Title>
				}
				style={{ width: 480, margin: 'auto' }}
			>
				<Form layout="vertical" form={form} onFinish={onFinish}>
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

					<Form.Item>
						<Button type="primary" block loading={loading}>
							Đặt lại mật khẩu
						</Button>
					</Form.Item>

					<Divider>Hoặc</Divider>

					<Link href={`/auth/login`} style={{ float: 'right' }}>
						<Button type="primary">Đăng nhập</Button>
					</Link>

					<Link href={`/auth/register`} style={{ float: 'left' }}>
						<Button>Đăng ký</Button>
					</Link>
				</Form>
			</Card>
		</Row>
	);
};

export default withLayout(ResetPasswordPage);
