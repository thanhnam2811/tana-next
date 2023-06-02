import apiClient from '@/api/apiClient';
import { UserType } from '@/types/user.type';

const getProfileApi = () => apiClient.get<UserType>('/users/profile').then((res) => res.data);

export default getProfileApi;
