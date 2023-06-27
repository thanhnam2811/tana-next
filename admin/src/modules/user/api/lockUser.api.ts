import { apiClient } from '@common/api';
import { UserType } from '@modules/user/types';

export const lockUserApi = (id: string, reason: string) =>
	apiClient.put<UserType>(`/admin/lockUser/${id}`, { reasonLock: reason }).then((res) => res.data);
