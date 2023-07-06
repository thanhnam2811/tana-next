import { apiClient } from '@common/api';
import { ListType, ListFormType } from '@modules/list/types';

export const updateListApi = (id: string, list: ListFormType) =>
	apiClient.put<ListType>(`/list/${id}`, list).then((res) => res.data);
