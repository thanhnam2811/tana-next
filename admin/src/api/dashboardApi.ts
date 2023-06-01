import apiClient from './apiClient';

export interface IDashboardData {
	totalUser: number;
	numUserOnline: number;
	numAccessInDay: number;
	numUserCreateInDay: number;
}

export const dashboardApi = {
	endpoint: {
		getData: '/admin/dashboard',
	},

	getData: () => apiClient.get<IDashboardData>(dashboardApi.endpoint.getData),
};
