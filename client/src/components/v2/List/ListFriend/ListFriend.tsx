import { InfinitFetcherType } from '@hooks';
import { UserType } from '@interfaces';
import { List } from 'antd';
import React, { useEffect } from 'react';

interface Props {
	fetcher: InfinitFetcherType<UserType>;
	threshHold?: number;
}

export function ListFriend({ fetcher, threshHold = 200 }: Props) {
	console.log('ListFriend');

	useEffect(() => {
		const handleScroll = (e: Event) => {
			const el = e.target;
			if (!el) return;

			if (!fetcher.hasMore || fetcher.fetching) return; // No more data or fetching

			const { scrollTop, scrollHeight, clientHeight } = el as HTMLDivElement;
			const isBottom = scrollHeight - scrollTop - clientHeight < threshHold;

			if (isBottom) fetcher.loadMore();
		};

		const containerEL = document.getElementById('list-friend');
		containerEL?.addEventListener('scroll', handleScroll);

		return () => {
			containerEL?.removeEventListener('scroll', handleScroll);
		};
	}, [fetcher.hasMore, fetcher.fetching]);

	return (
		<List<UserType>
			dataSource={fetcher.data}
			renderItem={(user) => <List.Item>{user.fullname}</List.Item>}
			loading={fetcher.fetching}
			loadMore="Loading..."
			id="list-friend"
		/>
	);
}
