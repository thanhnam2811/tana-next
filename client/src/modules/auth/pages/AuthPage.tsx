import { withLayout } from '@layout/v2';
import { Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Lottie from 'react-lottie-player';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useAuth } from '../hooks';
import { LoginForm, RegisterForm } from '../components';

function AuthPage() {
	const router = useRouter();
	const { type, from } = router.query;

	const isLogin = !type || type === 'login';
	const loginRef = useRef(null);
	const registerRef = useRef(null);
	const nodeRef = isLogin ? loginRef : registerRef;

	// Check if user is logged in
	const { authUser } = useAuth();
	useEffect(() => {
		if (authUser) {
			toast('Bạn đã đăng nhập rồi!', { icon: '👋' });
			router.replace((from as string) || '/home');
		}
	}, []);

	// don't render anything if user is logged in
	if (authUser) return null;

	return (
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
				<SwitchTransition mode="out-in">
					<CSSTransition
						key={isLogin ? 'login' : 'register'}
						nodeRef={nodeRef}
						addEndListener={(done: any) => {
							const currentNode: any = nodeRef.current;
							currentNode?.addEventListener('transitionend', done, false);
						}}
						classNames="fade"
					>
						<div ref={nodeRef}>{isLogin ? <LoginForm /> : <RegisterForm />}</div>
					</CSSTransition>
				</SwitchTransition>
			</Col>
		</Row>
	);
}

export default withLayout(AuthPage);
