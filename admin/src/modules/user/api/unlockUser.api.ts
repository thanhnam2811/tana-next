import { apiClient } from '@common/api';
import { UserType } from '@modules/user/types';

export const unlockUserApi = (id: string) => apiClient.put<UserType>(`/admin/unlockUser/${id}`).then((res) => res.data);
