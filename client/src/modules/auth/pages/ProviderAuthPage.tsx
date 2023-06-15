// noinspection JSIgnoredPromiseFromCall

import { withLayout } from '@layout/components';
import { Avatar, Card, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';
import { authProviders } from '@modules/auth/data';

const ProviderAuthPage = () => {
	const router = useRouter();
	const { login } = useAuth();

	const { providerId, accessToken, refreshToken } = router.query as { [key: string]: string };

	const provider = authProviders.find((p) => p.id === providerId);

	useEffect(() => {
		const loginWithProvider = async () => {
			const toastId = toast.loading('Đang xử lý...');

			try {
				// Save credentials
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);

				// Login by token
				await login();

				// Show success toast and redirect to home page
				toast.success(`Đăng nhập với ${provider?.name} thành công!`, { id: toastId });
				await router.replace('/');
			} catch (error: any) {
				// Show error toast and redirect to login page
				toast.error(`Đăng nhập với ${provider?.name} thất bại! Lỗi: ${error.toString()}`, { id: toastId });
				await router.replace('/auth/login');
			}
		};

		if (router.isReady) {
			// Redirect to login page if provider is not found
			if (!provider) router.replace('/auth/login');
			// Redirect to login page if access token and refresh token are not available
			else if (!accessToken || !refreshToken) {
				toast.error(`Đăng nhập với ${provider?.name} thất bại!`);
				router.replace('/auth/login');
			}

			// Login if access token and refresh token are available
			else loginWithProvider();
		}
	}, [router.isReady]);

	return (
		<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Card>
				<Card.Meta
					description={<Spin />}
					title={`Đang đăng nhập với ${provider?.name}`}
					avatar={<Avatar src={provider?.icon} />}
				/>
			</Card>
		</div>
	);
};

export default withLayout(ProviderAuthPage);
