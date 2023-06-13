import { WhiteBox } from '@components/Box';
import { useFetcher } from '@common/hooks';
import { ListFriend } from '@common/components/List/ListFriend';

interface Props {
	user: any;
}

export function FriendTab({ user }: Props) {
	const userFetcher = useFetcher({ api: `/users/${user._id}/friends` });

	return (
		<WhiteBox p={2}>
			<ListFriend fetcher={userFetcher} />
		</WhiteBox>
	);
}
