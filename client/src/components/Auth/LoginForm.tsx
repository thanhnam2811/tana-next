import { GithubIcon, GoogleIcon } from '@assets/icons';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Divider, Grid, IconButton, Link, TextField, Tooltip, Typography } from '@mui/material';
import { useUserStore } from '@store';
import { SERVER_URL } from '@utils/common';
import { validate } from 'email-validator';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ILoginForm {
	email: string;
	password: string;
}

export function LoginForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ILoginForm>();

	const { login } = useUserStore();

	const onSubmit = async (data: ILoginForm) => {
		const toastId = toast.loading('Đang đăng nhập...');
		try {
			await login(data);
			toast.success('Đăng nhập thành công!', { id: toastId });
			router.replace('/home');
		} catch (error: any) {
			toast.error(error.toString(), { id: toastId });
		}
	};

	const handleLoginWithGoogle = () => {
		window.open(`${SERVER_URL}/auth/google`, '_self');
	};

	const handleLoginWithGithub = () => {
		window.open(`${SERVER_URL}/auth/github`, '_self');
	};

	const handleRegister = (e: any) => {
		e.preventDefault();
		router.push('/auth/register');
	};

	const handleForgotPassword = (e: any) => {
		e.preventDefault();
		router.push('/auth/forgot-password');
	};

	return (
		<Box p={3} display="flex" flexDirection="column" gap={3} flexWrap="nowrap">
			{/* Header */}
			<Box display="flex" justifyContent="center">
				<Typography variant="h3" color="primary">
					Đăng nhập
				</Typography>
			</Box>

			{/* Form */}
			<Box component="form" display="flex" flexDirection="column" gap="8px" onSubmit={handleSubmit(onSubmit)}>
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
					required
					autoComplete="current-password"
					label="Mật khẩu"
					variant="outlined"
					fullWidth
					type="password"
					{...register('password')}
					disabled={isSubmitting}
				/>
				<LoadingButton
					loading={isSubmitting}
					loadingIndicator="Đang đăng nhập"
					sx={{ height: '56px' }}
					variant="contained"
					type="submit"
				>
					Đăng nhập
				</LoadingButton>
			</Box>

			{/* Another login method */}
			<Divider>
				<Typography variant="body1" color="inActive">
					đăng nhập với
				</Typography>
			</Divider>
			<Grid item xs={12}>
				<Grid container justifyContent="center">
					<Grid item xs="auto">
						<Tooltip title="Đăng nhập với Google">
							<IconButton onClick={handleLoginWithGoogle}>
								<Avatar src={GoogleIcon.src} alt="Google" />
							</IconButton>
						</Tooltip>
					</Grid>
					<Grid item xs="auto">
						<Tooltip title="Đăng nhập với Github">
							<IconButton onClick={handleLoginWithGithub}>
								<Avatar src={GithubIcon.src} alt={'Github'} />
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</Grid>

			{/* Register Link */}
			<Box display="flex" alignItems="center" flexDirection="column">
				<Typography variant="body1">
					Bạn chưa có tài khoản?{' '}
					<Link
						variant="body1"
						color="primary"
						sx={{
							textTransform: 'none',
							display: 'inline',
							cursor: 'pointer',
							textDecoration: 'none',
						}}
						onClick={handleRegister}
					>
						Đăng ký ngay!
					</Link>
				</Typography>
				<Link
					variant="body1"
					color="primary"
					onClick={handleForgotPassword}
					sx={{
						textTransform: 'none',
						display: 'block',
						cursor: 'pointer',
						textDecoration: 'none',
					}}
				>
					Quên mật khẩu?
				</Link>
			</Box>
		</Box>
	);
}
