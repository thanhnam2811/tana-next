import { LoadingButton } from '@mui/lab';
import { Box, Link, TextField, Typography } from '@mui/material';
import { authApi } from '@utils/api';
import { validate } from 'email-validator';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function RegisterForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		getValues,
	} = useForm();

	const onSubmit = async (data: any) => {
		const toastId = toast.loading('Đang đăng ký...');
		try {
			await authApi.register(data);
			toast.success('Đăng ký thành công! Vui lòng đăng nhập lại để tiếp tục!', { id: toastId });
			router.push('/auth/login');
		} catch (error: any) {
			toast.error(error.toString(), { id: toastId });
		}
	};

	return (
		<Box p={3} display="flex" flexDirection="column" gap={3} flexWrap="nowrap">
			{/* Header */}
			<Box display="flex" justifyContent="center">
				<Typography variant="h3" color="primary">
					Đăng ký
				</Typography>
			</Box>

			{/* Form */}
			<Box component="form" display="flex" flexDirection="column" gap="8px" onSubmit={handleSubmit(onSubmit)}>
				<TextField
					required
					label="Họ và tên"
					variant="outlined"
					fullWidth
					{...register('fullname')}
					disabled={isSubmitting}
				/>
				<TextField
					error={!!errors.email}
					helperText={errors.email?.message as string}
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
					disabled={isSubmitting}
				/>
				<TextField
					autoComplete="current-password"
					label="Mật khẩu"
					required
					variant="outlined"
					fullWidth
					type="password"
					{...register('password')}
					disabled={isSubmitting}
				/>
				<TextField
					autoComplete="confirmPassword"
					label="Xác nhận lại mật khẩu"
					required
					variant="outlined"
					fullWidth
					type="password"
					error={!!errors.confirmPassword}
					helperText={errors.confirmPassword?.message as string}
					{...register('confirmPassword', {
						required: true,
						validate: (value) => {
							if (value !== getValues('password')) {
								return 'Mật khẩu không khớp!';
							}
						},
					})}
					disabled={isSubmitting}
				/>
				<LoadingButton
					sx={{ height: '56px' }}
					variant="contained"
					type="submit"
					loading={isSubmitting}
					loadingIndicator="Đang đăng ký"
				>
					Đăng ký
				</LoadingButton>
			</Box>

			{/* Login Link */}
			<Box display="flex" justifyContent="center">
				<Typography variant="body1">
					Bạn đã có tài khoản?{' '}
					<Link
						variant="body1"
						color="primary"
						sx={{
							textTransform: 'none',
							display: 'inline',
							cursor: 'pointer',
							textDecoration: 'none',
						}}
						onClick={(e) => {
							e.preventDefault();
							router.push('/auth/login');
						}}
					>
						Đăng nhập ngay!
					</Link>
				</Typography>
			</Box>
		</Box>
	);
}
