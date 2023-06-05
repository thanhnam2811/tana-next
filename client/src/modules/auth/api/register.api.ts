import { apiClient } from '@common/api';
import { IRegisterParams } from '../types';

export const registerApi = (data: IRegisterParams) => apiClient.post('/auth/register', data).then((res) => res.data);
