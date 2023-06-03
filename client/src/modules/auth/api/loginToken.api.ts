import { apiClient } from '@common/api';
import { UserType } from '@interfaces';

export const loginTokenApi = () => apiClient.get<UserType>('/users/profile').then((res) => res.data);
