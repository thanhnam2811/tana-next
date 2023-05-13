import apiClient from './apiClient';

export interface IDashboardData {
	totalUser: number;
	numUserOnline: number;
	numAccessInDay: number;
	numUserCreateInDay: number;
}

export const dashboardApi = {
	getData: () => apiClient.get<IDashboardData>('/admin/dashboard'),
};
