import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Auth() {
	const router = useRouter();

	// Redirect to login page
	useEffect(() => {
		router.push('/auth/login');
	}, [router]);

	return null;
}
