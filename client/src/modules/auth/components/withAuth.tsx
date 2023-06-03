import { useRouter } from 'next/router';
import { NextComponentType } from 'next';
import { useEffect } from 'react';
import { useAuth } from '../hooks';

export function withAuth(Component: NextComponentType) {
	const Auth: NextComponentType = (props: any) => {
		const router = useRouter();
		const { authUser } = useAuth();

		// If user is not logged in, redirect to login page
		useEffect(() => {
			if (!authUser)
				router.push({ pathname: '/auth/login', query: { redirect: router.pathname } }, '/auth/login');
		}, [authUser]);

		if (!authUser) return null;

		// If user is logged in, return original component
		return <Component {...props} />;
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
}
