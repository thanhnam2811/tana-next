import { useRouter } from 'next/router';
import { useAuth } from '@hooks';
import { NextComponentType } from 'next';
import { useEffect } from 'react';

export function withAuth(Component: NextComponentType) {
	const Auth = (props: any) => {
		const router = useRouter();
		const { user } = useAuth();

		// If user is not logged in, redirect to login page
		useEffect(() => {
			if (!user) router.push('/auth/login');
		}, [router, user]);

		// If user is logged in, return original component
		return <Component {...props} />;
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
}
