import { apiClient } from '@common/api';

export const forgotPasswordApi = (email: string) =>
	apiClient.post('/auth/password-reset', { email }).then((res) => res.data);
