import { apiClient } from '@common/api';
import { ListType } from '@modules/list/types';

export const addListItemsApi = (id: string, items: string[]) =>
	apiClient.patch<ListType>(`/list/${id}/items/add`, { items }).then((res) => res.data);
