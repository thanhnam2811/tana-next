import { WhiteBox } from '@components/Box';
import { FilterUser, ListUser } from '@components/List';
import { useInfiniteFetcher } from '@hooks';
import { CenterArea } from '@layout';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
	user: any;
}

export function FriendTab({ user }: Props) {
	const router = useRouter();
	const userFetcher = useInfiniteFetcher(`/users/${user._id}/friends`);

	const onUserClick = (user: any) => {
		router.push({ pathname: '/profile', query: { id: user._id } });
	};

	return (
		<CenterArea alignItems="flex-start">
			<WhiteBox p={2}>
				<FilterUser fetcher={userFetcher} />

				<ListUser onUserClick={onUserClick} fetcher={userFetcher} />
			</WhiteBox>
		</CenterArea>
	);
}
