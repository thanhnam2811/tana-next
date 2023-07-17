import { ReportFormType, ReportType } from '@modules/report/types';
import { apiClient } from '@common/api';

export const reportApi = (data: ReportFormType) => apiClient.post<ReportType>('/reports', data).then((res) => res.data);
