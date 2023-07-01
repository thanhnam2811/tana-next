import { apiClient } from '@common/api';
import { ListType } from '@modules/list/types';

export const deleteListApi = (id: string) => apiClient.delete<ListType>(`/list/${id}`).then((res) => res.data);
