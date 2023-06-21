import { withLayout } from '@layout/components';
import { Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Lottie from 'react-lottie-player';
import { LoginForm } from '../components';
import { useAuth } from '../hooks';
import SEO from '@common/components/SEO';

function LoginPage() {
	const router = useRouter();
	const { from } = router.query;

	const { authUser } = useAuth();
	useEffect(() => {
		if (authUser) {
			router.replace((from as string) || '/home');
		}
	}, []);

	return (
		<>
			<SEO title="TaNa - Đăng nhập" robot />

			<Row style={{ maxWidth: 1200, margin: 'auto', flex: 1, height: '100%' }} align="middle" justify="center">
				<Col span={12} style={{ height: 'fit-content' }}>
					<Lottie
						path="https://assets6.lottiefiles.com/packages/lf20_xd8pnngo.json"
						speed={1}
						loop
						play
						style={{ width: '100%', height: '100%' }}
					/>
				</Col>

				<Col span={12} style={{ height: 'fit-content' }}>
					<LoginForm />
				</Col>
			</Row>
		</>
	);
}

export default withLayout(LoginPage);
