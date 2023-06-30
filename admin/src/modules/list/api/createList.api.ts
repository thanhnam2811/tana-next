import { apiClient } from '@common/api';
import { ListType, ListFormType } from '@modules/list/types';

export const createListApi = (list: ListFormType) => apiClient.post<ListType>('/list', list).then((res) => res.data);
