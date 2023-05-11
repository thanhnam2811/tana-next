import { WhiteBox } from '@components/Box';
import { useAppDispatch } from '@hooks';
import { Box, CircularProgress, Typography } from '@mui/material';
import { authApi } from '@utils/api';
import { authProviders } from '@utils/data';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { setCookie } from 'react-use-cookie';
import Swal from 'sweetalert2';
import { setUser } from '../../../redux/slice/userSlice';

const Provider = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const { providerId, accessToken, refreshToken } = router.query as { [key: string]: string };

	const provider = authProviders.find((p) => p.id === providerId);

	useEffect(() => {
		const login = async () => {
			const toastId = toast.loading('Đang xử lý...');

			try {
				// Get user profile
				const res = await authApi.getProfile();
				const user = res.data;

				// Save credentials to cookies
				setCookie('accessToken', accessToken);
				setCookie('refreshToken', refreshToken);
				dispatch(setUser(user));

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
	}, [accessToken, dispatch, provider, providerId, refreshToken, router]);

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
