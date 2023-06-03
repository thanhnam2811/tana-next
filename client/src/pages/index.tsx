import { useAuth } from '@modules/auth/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Index() {
	const { authUser } = useAuth();

	const router = useRouter();
	useEffect(() => {
		if (authUser) router.replace('/home');
		else router.replace('/landing');
	}, []);

	return null;
}
