import { useRouter } from 'next/router';
import { NextComponentType } from 'next';
import { useEffect } from 'react';
import { useUserStore } from '@store';

export function withAuth(Component: NextComponentType) {
	const Auth: NextComponentType = (props: any) => {
		const router = useRouter();
		const { user } = useUserStore();

		// If user is not logged in, redirect to login page
		useEffect(() => {
			if (!user) router.push({ pathname: '/auth/login', query: { from: router.pathname } }, '/auth/login');
		}, []);

		if (!user) return null;

		// If user is logged in, return original component
		return <Component {...props} />;
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
}
