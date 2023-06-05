import { WhiteBox } from '@components/Box';
import { FilterUser } from '@components/List/ListUser';
import { ListFriend } from '@components/v2/List/ListFriend';
import { useFetcher } from '@common/hooks';

interface Props {
	user: any;
}

export function FriendTab({ user }: Props) {
	const userFetcher = useFetcher({ api: `/users/${user._id}/friends` });

	return (
		<WhiteBox p={2}>
			<FilterUser fetcher={userFetcher} />

			<ListFriend fetcher={userFetcher} />
		</WhiteBox>
	);
}
