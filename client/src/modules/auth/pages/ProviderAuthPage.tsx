import Layout from '@layout/components';
import { Avatar, Card, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';
import { AuthProvider } from '@modules/auth/data';
import SEO from '@common/components/SEO';

export interface ProviderAuthPageProps {
	provider: AuthProvider;
}

const ProviderAuthPage = ({ provider }: ProviderAuthPageProps) => {
	const router = useRouter();
	const { login } = useAuth();

	useEffect(() => {
		const loginWithProvider = async () => {
			const toastId = toast.loading('Đang xử lý...');

			const { accessToken, refreshToken } = router.query as { [key: string]: string };

			if (!accessToken || !refreshToken) {
				toast.error(`Đăng nhập với ${provider?.name} thất bại!`, { id: toastId });
				return router.replace('/auth/login');
			}

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

		// Login if access token and refresh token are available
		if (router.isReady) loginWithProvider().then();
	}, [router.isReady]);

	return (
		<Layout.Container>
			<SEO title={`Đăng nhập với ${provider?.name}`} robot />

			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Card>
					<Card.Meta
						description={<Spin />}
						title={`Đang đăng nhập với ${provider?.name}`}
						avatar={<Avatar src={provider?.icon} />}
					/>
				</Card>
			</div>
		</Layout.Container>
	);
};

export default ProviderAuthPage;
