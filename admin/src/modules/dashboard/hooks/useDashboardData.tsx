import useSWR from 'swr';
import IDashboardData from '../types/IDashboardData';

export function useDashboardData() {
	return useSWR<IDashboardData>('/admin/dashboard');
}
