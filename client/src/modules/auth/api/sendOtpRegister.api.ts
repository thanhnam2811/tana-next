import { apiClient } from '@common/api';
import { RegisterAccount } from '@modules/auth/types';

export const sendOtpRegisterApi = (data: RegisterAccount) =>
	apiClient.post('/auth/otp/register', data).then((res) => res.data);
