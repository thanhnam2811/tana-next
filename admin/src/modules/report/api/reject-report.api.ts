import { apiClient } from '@common/api';

export const rejectReportApi = (reportId: string) => apiClient.put(`/reports/${reportId}/reject`);
