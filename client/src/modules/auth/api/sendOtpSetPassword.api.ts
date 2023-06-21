import { apiClient } from '@common/api';

export const sendOtpSetPasswordApi = () => apiClient.post('/auth/otp/set-password').then((res) => res.data);
