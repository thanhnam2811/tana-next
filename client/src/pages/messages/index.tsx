import { withAuth } from '@modules/auth/components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Messages() {
	const router = useRouter();

	useEffect(() => {
		router.push('/messages/all');
	}, []);

	return null;
}

export default withAuth(Messages);
