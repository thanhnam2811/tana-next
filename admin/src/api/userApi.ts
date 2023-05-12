import { AxiosRequestConfig } from 'axios';
import apiClient from './apiClient';
import { IUser } from '@/interface';
import { IPaginationResponse } from '@/interface/api-interface';

export const userApi = {
	get: (config: AxiosRequestConfig) => apiClient.get<IPaginationResponse<IUser>>('/admin/searchUser', config),
};
