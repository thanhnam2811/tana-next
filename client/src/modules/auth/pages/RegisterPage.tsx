import Layout, { withLayout } from '@layout/components';
import { Button, Form, Space, StepProps, Steps } from 'antd';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { AccountForm, InfoForm, PasswordForm } from '../components';
import { useAuth } from '../hooks';
import SEO from '@common/components/SEO';
import { IRegisterData, RegisterAccount } from '@modules/auth/types';
import { toast } from 'react-hot-toast';
import { registerApi, sendOtpRegisterApi } from '@modules/auth/api';

const ACCOUNT_STEP = 0;
const PASSWORD_STEP = 1;
const INFO_STEP = 2;

function RegisterPage() {
	const router = useRouter();
	const { from } = router.query;

	// Check if user is logged in
	const { authUser, updateAuthUser, login } = useAuth();
	useEffect(() => {
		if (authUser && step !== INFO_STEP) {
			router.replace((from as string) || '/home');
		}
	}, []);

	const [data, setData] = useState<Partial<IRegisterData>>({});
	const [step, setStep] = useState(2);
	const nextStep = () => {
		if (step === steps.length - 1) {
			return router.push('/home');
		}

		setStep((step) => step + 1);
	};
	const prevStep = () => setStep((step) => step - 1);

	const canSkip = step === ACCOUNT_STEP;
	const canBack = step === PASSWORD_STEP;

	const steps: (StepProps & { content: ReactNode })[] = [
		{
			title: 'Tài khoản',
			content: <AccountForm data={data} />,
		},
		{
			title: 'Mật khẩu',
			content: <PasswordForm data={data} />,
		},
		{
			title: 'Thông tin cá nhân',
			content: <InfoForm />,
		},
	];

	const sendOTP = async (values: RegisterAccount) => {
		const toastId = toast.loading('Đang gửi mã xác nhận...');

		try {
			await sendOtpRegisterApi(values);
			toast.success('Gửi mã xác nhận thành công!', { id: toastId });
		} catch (error: any) {
			toast.error(`Gửi mã xác nhận thất bại! Lỗi: ${error.message || error.toString()}`, { id: toastId });
			throw error;
		}
	};

	return (
		<>
			<SEO title="TaNa - Đăng ký" robot />

			<Layout.Content style={{ margin: 'auto', flex: 1, height: '100%' }}>
				<Form.Provider
					onFormFinish={async (name, { forms, values }) => {
						if (name === 'account') {
							const accountForm = forms['account'];
							try {
								await sendOTP(values as RegisterAccount);
								setData(values);
								nextStep();
							} catch (error: any) {
								const errorText = error.message || error.toString();
								accountForm.setFields([
									{
										name: 'email',
										errors: [errorText],
									},
								]);
							}
						} else if (name === 'password') {
							const passwordForm = forms['password'];
							try {
								const { accessToken, refreshToken } = await registerApi({
									...data,
									...values,
								} as IRegisterData);
								nextStep();

								localStorage.setItem('accessToken', accessToken);
								localStorage.setItem('refreshToken', refreshToken);

								await login();
							} catch (error: any) {
								const errorText = error.message || error.toString();
								passwordForm.setFields([
									{
										name: 'otp',
										errors: [errorText],
									},
								]);
							}
						} else if (name === 'info') {
							const toastId = toast.loading('Đang cập nhật thông tin...');
							try {
								await updateAuthUser(values);
								toast.success('Cập nhật thông tin thành công!', { id: toastId });

								await router.replace('/home');
							} catch (error) {
								toast.error(`Cập nhật thông tin thất bại! Lỗi: ${error}`, { id: toastId });
							}
						}
					}}
				>
					<Space direction="vertical" style={{ width: '100%', height: '100%' }}>
						<Steps current={step} size="small" items={steps} />

						<div
							style={{
								flex: 1,
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
							{steps[step].content}
						</div>

						<Space style={{ justifyContent: 'flex-end' }}>
							{canBack && <Button onClick={prevStep}>Quay lại</Button>}

							{canSkip && <Button onClick={nextStep}>Bỏ qua</Button>}
						</Space>
					</Space>
				</Form.Provider>
			</Layout.Content>
		</>
	);
}

export default withLayout(RegisterPage);
