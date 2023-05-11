import { WhiteBox } from '@components/Box';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { authApi } from '@utils/api';
import { validate } from 'email-validator';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Lottie from 'react-lottie-player';

const ForgotPasswordPage = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data: any) => {
		const toastId = toast.loading('Đang xử lý...');
		try {
			// Call api
			await authApi.forgotPassword(data.email);

			// Show success
			toast.success('Đã gửi yêu cầu đổi mật khẩu!', { id: toastId });
		} catch (error) {
			// Show error
			toast.error('Gửi yêu cầu thất bại!', { id: toastId });
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
					path="https://assets3.lottiefiles.com/private_files/lf30_GjhcdO.json"
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
							Quên mật khẩu
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
							error={!!errors.email}
							required
							autoComplete="email"
							label="Email"
							variant="outlined"
							fullWidth
							{...register('email', {
								required: true,
								validate: (value) => {
									if (!validate(value)) {
										return 'Email không hợp lệ!';
									}
								},
							})}
							helperText={errors.email?.message as string}
						/>
						<LoadingButton
							sx={{ height: '56px' }}
							variant="contained"
							type="submit"
							loading={isSubmitting}
							loadingIndicator="Đang xử lý..."
						>
							Gửi
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

export default ForgotPasswordPage;
