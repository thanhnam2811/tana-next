import { withLayout } from '@layout/components';
import { Button, Col, Form, Row, Space, StepProps, Steps } from 'antd';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { AccountForm, PasswordForm } from '../components';
import { useAuth } from '../hooks';
import SEO from '@common/components/SEO';
import { IRegisterData, RegisterAccount } from '@modules/auth/types';
import { toast } from 'react-hot-toast';
import { registerApi, sendOtpRegisterApi } from '@modules/auth/api';

function RegisterPage() {
	const router = useRouter();
	const { from } = router.query;

	// Check if user is logged in
	const { authUser } = useAuth();
	useEffect(() => {
		if (authUser) {
			router.replace((from as string) || '/home');
		}
	}, []);

	const [data, setData] = useState<Partial<IRegisterData>>({});
	const [step, setStep] = useState(0);
	const nextStep = () => setStep((step) => step + 1);
	const prevStep = () => setStep((step) => step - 1);

	const canSkip = step === 2;
	const canBack = step === 1;

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
			content: <div>Thông tin cá nhân</div>,
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

			<Row style={{ maxWidth: 1200, margin: 'auto', flex: 1, height: '100%' }} align="middle" justify="center">
				<Col span={12} style={{ height: 'fit-content' }}>
					<Lottie
						path="https://assets6.lottiefiles.com/packages/lf20_xd8pnngo.json"
						speed={1}
						loop
						play
						style={{ width: '100%', height: '100%' }}
					/>
				</Col>

				<Col span={12} style={{ height: 'fit-content', padding: 16 }}>
					<Form.Provider
						onFormFinish={async (name, { forms, values }) => {
							console.log(name, values);
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
									const res = await registerApi({ ...data, ...values } as IRegisterData);
									nextStep();
									console.log({ res });
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
								console.log(values);
							}
						}}
					>
						<Space direction="vertical" style={{ width: '100%' }}>
							<Steps current={step} size="small" items={steps} />

							{steps[step].content}

							<Space style={{ justifyContent: 'flex-end' }}>
								{canBack && <Button onClick={prevStep}>Quay lại</Button>}

								{canSkip && <Button onClick={nextStep}>Bỏ qua</Button>}
							</Space>
						</Space>
					</Form.Provider>
				</Col>
			</Row>
		</>
	);
}

export default withLayout(RegisterPage);
