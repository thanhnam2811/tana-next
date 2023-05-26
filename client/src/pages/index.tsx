import { useUserStore } from '@store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Index() {
	const { user } = useUserStore();

	const router = useRouter();
	useEffect(() => {
		if (user) router.replace('/home');
		else router.replace('/landing');
	}, []);

	return null;
}
