import { WhiteBox } from '@components/Box';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { authApi } from '@utils/api';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Lottie from 'react-lottie-player';

const ResetPasswordPage = () => {
	const router = useRouter();
	const { id, token } = router.query as { id: string; token: string };

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
	} = useForm();

	const onSubmit = async (data: any) => {
		if (id && token) {
			const toastId = toast.loading('Đang xử lý...');
			try {
				// Call api
				await authApi.resetPassword({ id, token, password: data.password });

				// Show success
				toast.success('Đã đặt lại mật khẩu!', { id: toastId });

				// Redirect to login
				router.push('/auth/login');
			} catch (error) {
				// Show error
				toast.error('Đặt lại mật khẩu thất bại!', { id: toastId });
			}
		}
	};

	const handleLogin = () => router.push('/auth/login');

	const handleRegister = () => router.push('/auth/register');

	return (
		<Container
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				overflow: 'hidden',
				alignSelf: 'center',
				justifySelf: 'center',
			}}
		>
			<Box
				flex={1}
				display={{
					md: 'block',
					xs: 'none',
					height: '80%',
				}}
			>
				<Lottie
					path="https://assets3.lottiefiles.com/packages/lf20_lz8wv7e7.json"
					speed={1}
					loop
					play
					style={{ width: '100%', height: '100%' }}
				/>
			</Box>
			<WhiteBox sx={{ height: 'fit-content', flex: 1, maxWidth: '600px' }}>
				<Box p={3} display="flex" flexDirection="column" gap={3} flexWrap="nowrap">
					{/* Header */}
					<Box display="flex" justifyContent="center">
						<Typography variant="h4" color="primary">
							Đặt lại mật khẩu
						</Typography>
					</Box>

					{/* Form */}
					<Box
						component="form"
						display="flex"
						flexDirection="column"
						gap="8px"
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextField
							type="password"
							required
							autoComplete="password"
							label="Mật khẩu mới"
							variant="outlined"
							fullWidth
							{...register('password', {
								required: true,
							})}
						/>
						<TextField
							error={!!errors.confirmPassword}
							type="password"
							required
							autoComplete="password"
							label="Nhập lại mật khẩu"
							variant="outlined"
							fullWidth
							{...register('confirmPassword', {
								required: true,
								validate: (value) => {
									if (value !== getValues('password')) {
										return 'Mật khẩu không khớp';
									}
								},
							})}
							helperText={errors.confirmPassword?.message as string}
						/>
						<LoadingButton
							sx={{ height: '56px' }}
							variant="contained"
							type="submit"
							loading={isSubmitting}
							loadingIndicator="Đang xử lý..."
						>
							Đặt lại mật khẩu
						</LoadingButton>
					</Box>

					{/* Footer */}
					<Box display="flex" justifyContent="space-between">
						<Button onClick={handleLogin} variant="outlined" type="button">
							Đăng nhập
						</Button>
						<Button onClick={handleRegister} variant="outlined" type="button">
							Đăng ký
						</Button>
					</Box>
				</Box>
			</WhiteBox>
		</Container>
	);
};

export default ResetPasswordPage;
