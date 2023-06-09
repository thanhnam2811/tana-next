import { FriendType, RelationshipType } from '../types';

export const friendRelationshipMap: Record<FriendType, RelationshipType | null> = {
	friends: 'friend',
	requests: 'received',
	suggests: 'none',
	all: null,
};
