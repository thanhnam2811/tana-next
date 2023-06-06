import { BaseType } from 'antd/es/typography/Base';
import { RelationshipType } from '../types';

export const relationshipLabel: Record<RelationshipType, string> = {
	friend: 'Bạn bè',
	sent: 'Đã gửi',
	received: 'Chờ xác nhận',
	none: 'Chưa kết bạn',
	you: 'Bạn',
};

export const relationshipColor: Record<RelationshipType, BaseType> = {
	friend: 'success',
	sent: 'secondary',
	received: 'warning',
	none: 'danger',
	you: 'secondary',
};
