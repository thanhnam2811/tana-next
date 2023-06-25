import { apiClient } from '@common/api';

export const deleteActivityApi = async (id: string) => apiClient.delete(`/users/activities/${id}`);
