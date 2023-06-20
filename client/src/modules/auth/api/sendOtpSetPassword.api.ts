import { apiClient } from '@common/api';

export const sendOtpSetPasswordApi = () => apiClient.get('/auth/otp/set-password').then((res) => res.data);
