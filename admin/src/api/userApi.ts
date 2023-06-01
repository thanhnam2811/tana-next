import { AxiosRequestConfig } from 'axios';
import apiClient from './apiClient';
import { IUser } from '@/interface';
import { IPaginationResponse } from '@/interface/api-interface';

export const userApi = {
	endpoint: {
		searchUser: `/admin/searchUser`,
	},

	searchUser: (config: AxiosRequestConfig) =>
		apiClient.get<IPaginationResponse<IUser>>(userApi.endpoint.searchUser, config),
};
