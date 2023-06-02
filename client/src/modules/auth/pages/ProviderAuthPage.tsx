import { withLayout } from '@layout/v2';
import { authProviders } from '@utils/data';
import { Avatar, Card, Space, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks';

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
				toast.success('Đăng nhập thành công!', { id: toastId });
				router.replace('/');
			} catch (error: any) {
				// Show error toast and redirect to login page
				toast.error(`Đăng nhập với ${provider?.name} thất bại! Lỗi: ${error.toString()}`, { id: toastId });
				router.replace('/auth/login');
			}
		};

		// Redirect to login page if provider is not found
		if (!provider) {
			router.replace('/auth/login');
		}

		// Login if access token and refresh token are available
		else if (!accessToken || !refreshToken) {
			toast.error(`Đăng nhập với ${provider?.name} thất bại!`);
			router.replace('/auth/login');
		}

		// Redirect to login page if access token and refresh token are not available
		else {
			loginWithProvider();
		}
	}, []);

	return (
		<Space
			style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			<Card>
				<Card.Meta
					description={<Spin />}
					title={`Đang đăng nhập với ${provider?.name}`}
					avatar={<Avatar src={provider?.icon} />}
				/>
			</Card>
		</Space>
	);
};

export default withLayout(ProviderAuthPage);
