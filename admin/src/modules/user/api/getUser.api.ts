import { apiClient } from '@common/api';
import { UserType } from '@modules/user/types';

export const getUserApi = (id: string) => apiClient.get<UserType>(`/users/${id}`);
