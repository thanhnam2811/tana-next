import { withLayout } from '@layout/v2';
import { Button, Card, Col, Divider, Form, Input, Row, Typography, theme } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Lottie from 'react-lottie-player';
import { useState } from 'react';
import { forgotPasswordApi } from '../api';

const ForgotPasswordPage = () => {
	const router = useRouter();
	const { token } = theme.useToken();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: { email: string }) => {
		setLoading(true);

		const toastId = toast.loading('Đang gửi yêu cầu...');
		try {
			await forgotPasswordApi(values.email);

			toast.success('Gửi yêu thành công! Vui lòng kiểm tra email của bạn.', { id: toastId });

			router.push('/auth/reset-password');
		} catch (error) {
			toast.error(`Gửi yêu thất bại! Lỗi: ${error}`, { id: toastId });
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
						Quên mật khẩu
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

export default withLayout(ForgotPasswordPage);
