import { apiClient } from '@common/api';
import { IRegisterData } from '../types';

export const registerApi = (data: IRegisterData) => apiClient.post('/auth/register', data).then((res) => res.data);
