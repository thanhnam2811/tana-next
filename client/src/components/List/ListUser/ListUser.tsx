import { InfinitFetcherType } from '@hooks';
import { Box, CircularProgress, Collapse, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup } from 'react-transition-group';
import { Relationship, UserCard } from '../../Card/UserCard/UserCard';

interface Props {
	type?: string;
	relationship?: Relationship;
	fetcher: InfinitFetcherType;
	onUserClick: (user: any) => void;
}

export const ListUser = ({ type = 'friends', relationship = 'friend', fetcher, onUserClick }: Props) => {
	const { data, params, hasMore, loadMore, reload } = fetcher;

	const typeRef = useRef(type);
	// Fetch data when change type
	useEffect(() => {
		typeRef.current = type;
		reload();
	}, [type]);

	return (
		<InfiniteScroll
			dataLength={data.length}
			next={loadMore}
			hasMore={hasMore}
			loader={
				<Box key="loader" display="flex" justifyContent="center" m={2}>
					<CircularProgress />
				</Box>
			}
			endMessage={
				<Typography fontSize={16} textAlign="center" color="text.secondary" component="div">
					{data.length === 0 ? (
						<p>
							Không có kết quả nào
							{params.key && ` cho từ khóa "${params.key}"`}
						</p>
					) : (
						'Đã hiển thị hết kết quả'
					)}
				</Typography>
			}
			style={{ overflow: 'visible' }}
		>
			<TransitionGroup component={null}>
				{data.map((user, index) => (
					<Collapse key={user._id + index}>
						<UserCard
							user={user}
							relationship={user.relationship || relationship}
							sx={{ mt: index ? 1 : 0 }}
							onClick={() => onUserClick(user)}
						/>
					</Collapse>
				))}
			</TransitionGroup>
		</InfiniteScroll>
	);
};
