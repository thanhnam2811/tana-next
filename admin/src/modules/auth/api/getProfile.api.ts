import { apiClient } from '@common/api';
import { UserType } from '@common/types';

export const getProfileApi = () => apiClient.get<UserType>('/users/profile').then((res) => res.data);
