import { ListFriend } from '@modules/friend/components';
import React from 'react';
import { useUserContext } from '@modules/user/hooks';

export function FriendTab() {
	const { user, isCurrentUser } = useUserContext();

	return (
		<ListFriend
			api={`/users/${user._id}/friends`}
			title={isCurrentUser ? 'Bạn bè' : 'Bạn bè của ' + user.fullname}
		/>
	);
}
