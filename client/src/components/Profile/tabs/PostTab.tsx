import { CreatePost, ListPost } from '@components/v2/List/ListPost';
import { useInfiniteFetcherSWR } from '@hooks';
import { PostType, UserType } from '@interfaces';
import { CenterArea } from '@layout/Area';
import { Box, Stack } from '@mui/material';
import { useUserStore } from '@store';
import { PictureContainer } from '../PictureContainer';

interface Props {
	user: UserType;
}

export function PostTab({ user }: Props) {
	const { user: currentUser } = useUserStore();
	const isCurrentUser = user._id === currentUser?._id;

	const postsFetcher = useInfiniteFetcherSWR<PostType>({ api: `/users/${user._id}/posts` });

	return (
		<CenterArea alignItems="flex-start">
			<Stack height="100%" width="100%" spacing={2}>
				{/* Header */}
				<Box flex={0}>
					<PictureContainer user={user} />
				</Box>

				{/* Body */}
				{isCurrentUser && <CreatePost fetcher={postsFetcher} />}

				{/* Content */}
				<ListPost windowScroll fetcher={postsFetcher} />
			</Stack>
		</CenterArea>
	);
}
