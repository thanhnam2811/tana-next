import { NextComponentType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../hooks';
import { Spin } from 'antd';

export function withAuth(Component: NextComponentType) {
	const Auth: NextComponentType = (props: any) => {
		const router = useRouter();
		const { authUser, login } = useAuth();

		// If user is not logged in, redirect to login page
		useEffect(() => {
			if (!authUser) {
				const accessToken = localStorage.getItem('accessToken');
				if (!accessToken)
					router.replace({ pathname: '/auth/login', query: { redirect: router.pathname } }, '/auth/login');
				else login();
			}
		}, [authUser]);

		if (!authUser) {
			return (
				<Spin
					size="large"
					style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
				/>
			);
		}

		// If user is logged in, return original component
		return <Component {...props} />;
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
}
