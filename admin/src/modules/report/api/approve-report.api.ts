import { apiClient } from '@common/api';

export const approveReportApi = (reportId: string) => apiClient.put(`/reports/${reportId}/approve`);
