import useSWR from 'swr';
import { IDashboardData } from '../types';

export function useDashboardData() {
	return useSWR<IDashboardData>('/admin/dashboard');
}
