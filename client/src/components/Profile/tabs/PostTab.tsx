import { useInfiniteFetcherSWR } from '@hooks';
import { PostType, UserType } from '@interfaces';
import { CenterArea } from '@layout/Area';
import { Box, Stack } from '@mui/material';
import { useAuth } from '@modules/auth/hooks';
import { PictureContainer } from '../PictureContainer';
import { CreatePost, ListPost } from '@modules/post/components';

interface Props {
	user: UserType;
}

export function PostTab({ user }: Props) {
	const { authUser } = useAuth();
	const isCurrentUser = user._id === authUser?._id;

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
				<ListPost fetcher={postsFetcher} />
			</Stack>
		</CenterArea>
	);
}
