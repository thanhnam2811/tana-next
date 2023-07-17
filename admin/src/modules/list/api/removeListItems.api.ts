import { apiClient } from '@common/api';
import { ListType } from '@modules/list/types';

export const removeListItemsApi = (id: string, items: string[]) =>
	apiClient.patch<ListType>(`/list/${id}/items/remove`, { items }).then((res) => res.data);
