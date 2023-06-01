import useSWR from 'swr';
import IDashboardData from '../types/IDashboardData';

export default function useDashboardData() {
	return useSWR<IDashboardData>('/admin/dashboard');
}
