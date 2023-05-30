import { WhiteBox } from '@components/Box';
import { FilterUser } from '@components/List/ListUser';
import { useInfiniteFetcherSWR } from '@hooks';
import { CenterArea } from '@layout/Area';
import { useRouter } from 'next/router';
import { ListFriend } from '@components/v2/List/ListFriend';

interface Props {
	user: any;
}

export function FriendTab({ user }: Props) {
	const router = useRouter();
	console.log('FriendTab');
	const userFetcher = useInfiniteFetcherSWR({ api: `/users/${user._id}/friends` });

	const onUserClick = (user: any) => {
		router.push({ pathname: '/profile', query: { id: user._id } });
	};

	return (
		<CenterArea alignItems="flex-start">
			<WhiteBox p={2}>
				<FilterUser fetcher={userFetcher} />

				<ListFriend fetcher={userFetcher} />
			</WhiteBox>
		</CenterArea>
	);
}
