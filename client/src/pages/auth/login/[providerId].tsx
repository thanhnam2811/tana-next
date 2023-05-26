import { WhiteBox } from '@components/Box';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useUserStore } from '@store';
import { authProviders } from '@utils/data';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Provider = () => {
	const router = useRouter();
	const { getProfile } = useUserStore();

	const { providerId, accessToken, refreshToken } = router.query as { [key: string]: string };

	const provider = authProviders.find((p) => p.id === providerId);

	useEffect(() => {
		const login = async () => {
			const toastId = toast.loading('Đang xử lý...');

			try {
				// Save credentials
				localStorage.setItem('accessToken', accessToken as string);
				localStorage.setItem('refreshToken', refreshToken as string);

				// Get user profile
				getProfile();

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
		if (!provider) router.replace('/auth/login');
		// Login if access token and refresh token are available
		else if (!accessToken || !refreshToken) {
			Swal.fire({
				icon: 'error',
				title: 'Lỗi!',
				text: `Đăng nhập với ${provider?.name} thất bại!`,
			}).then(() => router.replace('/auth/login'));
		}

		// Redirect to login page if access token and refresh token are not available
		else {
			login();
		}
	}, [accessToken, provider, providerId, refreshToken, router]);

	return (
		<Box
			width="100%"
			height="100%"
			display="flex"
			justifyContent="center"
			alignItems="center"
			alignSelf="center"
			justifySelf="center"
		>
			<WhiteBox
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: 'fit-content',
					p: 2,
				}}
			>
				<Box position="relative">
					<Image src={provider?.icon as string} alt={provider?.name as string} width={40} height={40} />

					<CircularProgress
						size={52}
						sx={{
							position: 'absolute',
							top: -6,
							left: -6,
							zIndex: 1,
						}}
					/>
				</Box>
				<Typography variant="h6" sx={{ mt: 2 }}>
					Đang đăng nhập với {provider?.name} ...
				</Typography>
			</WhiteBox>
		</Box>
	);
};

export default Provider;
