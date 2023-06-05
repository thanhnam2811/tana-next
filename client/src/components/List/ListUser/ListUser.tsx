import { UserCard } from '@components/Card/UserCard';
import { FetcherType } from '@common/hooks';
import { RelationshipType, UserType } from '@common/types';
import { Box, CircularProgress, Collapse, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup } from 'react-transition-group';

interface Props {
	type?: string;
	relationship?: RelationshipType;
	fetcher: FetcherType<UserType>;
	onUserClick: (user: any) => void;
}

export const ListUser = ({ relationship = 'friend', fetcher, onUserClick }: Props) => {
	const { data, params, hasMore, loadMore } = fetcher;

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
