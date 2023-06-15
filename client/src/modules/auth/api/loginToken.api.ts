import { apiClient } from '@common/api';
import { UserType } from '@modules/user/types';

export const loginTokenApi = () => apiClient.get<UserType>('/users/profile').then((res) => res.data);
