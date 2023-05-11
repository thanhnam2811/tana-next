import { CreatePost, ListPost } from '@components/List';
import React from 'react';
import { Box, Stack } from '@mui/material';
import { useAuth, useInfiniteFetcher } from '@hooks';
import { PictureContainer } from '../PictureContainer';
import { CenterArea } from '@layout';

interface Props {
	user: any;
}

export function PostTab({ user }: Props) {
	const { user: currentUser } = useAuth();
	const isCurrentUser = user._id === currentUser?._id;

	const postsFetcher = useInfiniteFetcher(`/users/${user._id}/posts`);

	return (
		<CenterArea alignItems="flex-start">
			<Stack height="100%" width="100%" spacing={2}>
				{/* Header */}
				<Box flex="auto">
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
