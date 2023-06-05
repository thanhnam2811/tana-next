import { useFetcher } from '@common/hooks';
import { PostType, UserType } from '@common/types';
import { useAuth } from '@modules/auth/hooks';
import { CreatePost, ListPost } from '@modules/post/components';
import { Box, Stack } from '@mui/material';
import { PictureContainer } from '../PictureContainer';

interface Props {
	user: UserType;
}

export function PostTab({ user }: Props) {
	const { authUser } = useAuth();
	const isCurrentUser = user._id === authUser?._id;

	const postsFetcher = useFetcher<PostType>({ api: `/users/${user._id}/posts` });

	return (
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
	);
}
