import { LoginParams, authApi } from '@/api';
import { LoginSVG } from '@/assets';
import { useAuthStore } from '@/store';
import { App, Button, Card, Form, Input, Layout, Typography } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';
import styles from './Login.module.scss';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';

function Login() {
	const { state } = useLocation();
	const { isAuth, login } = useAuthStore();
	const { message } = App.useApp();

	const onFinish = async (values: LoginParams) => {
		const key = 'login';
		message.loading({ content: 'Đang đăng nhập...', key });

		try {
			// Call api
			const {
				data: { user },
			} = await authApi.login(values);

			// Update state and show message
			login(user);
			message.success({ content: 'Đăng nhập thành công!', key });
		} catch (error: any) {
			message.error({ content: error || 'Đăng nhập thất bại!', key });
		}
	};

	if (isAuth) {
		return <Navigate to={state?.from || '/'} replace />;
	}

	return (
		<Layout style={{ height: '100vh' }}>
			<Layout.Header className={styles.header}>
				<img src="/tana.svg" alt="logo" className={styles.logo} />
				<Typography.Title className={styles.title}>TaNa Admin</Typography.Title>
			</Layout.Header>

			<Layout.Content className={styles.content}>
				<div className={styles.left}>
					<img src={LoginSVG} alt="logo" className={styles.logo} />
				</div>
				<div className={styles.right}>
					<Card className={styles.card}>
						<Typography.Title level={2} className={styles.title}>
							Đăng nhập
						</Typography.Title>

						<Form layout="vertical" onFinish={onFinish}>
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
								<Input prefix={<UserOutlined />} size="large" />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập email!',
									},
									{
										min: 6,
										message: 'Mật khẩu phải có ít nhất 6 ký tự!',
									},
								]}
							>
								<Input type="password" prefix={<LockOutlined />} size="large" />
							</Form.Item>

							<Button
								type="primary"
								htmlType="submit"
								style={{ float: 'right' }}
								icon={<LoginOutlined />}
							>
								Đăng nhập
							</Button>
						</Form>
					</Card>
				</div>
			</Layout.Content>
		</Layout>
	);
}

export default Login;
