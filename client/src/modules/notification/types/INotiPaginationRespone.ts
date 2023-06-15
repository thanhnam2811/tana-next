import { IPaginationResponse } from '@common/types';
import { NotificationType } from '@modules/notification/types';

export interface INotiPaginationRespone extends IPaginationResponse<NotificationType> {
	numberUnread: number;
}
