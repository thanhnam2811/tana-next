import apiClient from '@common/api/apiClient';
import { UserType } from '@common/types/user.type';

export const getProfileApi = () => apiClient.get<UserType>('/users/profile').then((res) => res.data);
