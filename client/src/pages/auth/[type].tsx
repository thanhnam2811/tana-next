import { LoginForm, RegisterForm } from '@components/Auth';
import { WhiteBox } from '@components/Box';
import { useAuth } from '@hooks';
import { Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Lottie from 'react-lottie-player';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

export default function AuthPage() {
	const router = useRouter();
	const { type, from } = router.query;

	const isLogin = !type || type === 'login';
	const loginRef = useRef(null);
	const registerRef = useRef(null);
	const nodeRef = isLogin ? loginRef : registerRef;

	// Check if user is logged in
	const { user } = useAuth();
	useEffect(() => {
		if (user) {
			toast('Bạn đã đăng nhập rồi!', { icon: '👋' });
			router.replace((from as string) || '/home');
		}
	}, []);

	// don't render anything if user is logged in
	if (user) {
		return null;
	}

	return (
		<Container
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				overflow: 'hidden',
				alignSelf: 'center',
				justifySelf: 'center',
			}}
		>
			<Box
				display={{
					md: 'block',
					xs: 'none',
					height: '80%',
				}}
				flex={1}
			>
				<Lottie
					path="https://assets6.lottiefiles.com/packages/lf20_xd8pnngo.json"
					speed={1}
					loop
					play
					style={{ width: '100%', height: '100%' }}
				/>
			</Box>
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
					<Box
						ref={nodeRef}
						sx={{
							maxWidth: '600px',
							width: '100%',
							height: 'auto',
						}}
						flex={1}
					>
						<WhiteBox>{isLogin ? <LoginForm /> : <RegisterForm />}</WhiteBox>
					</Box>
				</CSSTransition>
			</SwitchTransition>
		</Container>
	);
}
