import React, { useEffect, useState } from 'react';

import { Avatar, Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { userApi } from '@utils/api';
import { getShortName } from '@utils/common';

interface Action {
	[key: string]: any;

	title: string;
	onClick: () => void;
	avatar?: string;
}

export function QuickContact() {
	const router = useRouter();
	const [listContact, setListContact] = useState<Action[]>([]);
	const [listSuggestions, setListSuggestions] = useState<Action[]>([]);

	useEffect(() => {
		const fetchContact = async () => {
			try {
				const res = await userApi.searchUser('friends', { size: 10 });
				const items = res.data.items as any[];

				setListContact(
					items.map((user: any) => ({
						title: user.fullname,
						avatar: user.profilePicture?.link,
						onClick: () => {
							router.push(`/profile/${user._id}`);
						},
					}))
				);
			} catch (error) {
				console.log(error);
			}
		};

		const fetchSuggestions = async () => {
			try {
				const res = await userApi.searchUser('suggests', { size: 10 });
				const items = res.data.items as any[];

				setListSuggestions(
					items.map((user: any) => ({
						title: user.fullname,
						avatar: user.profilePicture?.link,
						onClick: () => {
							router.push(`/profile/${user._id}`);
						},
					}))
				);
			} catch (error) {
				console.log(error);
			}
		};

		fetchContact();
		fetchSuggestions();
	}, []);

	return (
		<Box display="flex" flexDirection="column" height="100%">
			<Typography
				fontSize={18}
				fontWeight={600}
				sx={{
					mx: 1,
				}}
			>
				Liên hệ
			</Typography>
			<Box display="flex" flexDirection="column" maxHeight="100%" overflow="auto" flex={1}>
				{listContact.map((action, index) => (
					<Box
						key={index}
						display="flex"
						alignItems="center"
						sx={{
							p: '8px',
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: '#1877f22f',
							},
							borderRadius: '8px',
						}}
						onClick={action.onClick}
					>
						<Avatar sx={{ mr: 1 }} src={action.avatar}>
							{getShortName(action.title)}
						</Avatar>

						<Typography variant="subtitle2">{action.title}</Typography>
					</Box>
				))}
			</Box>

			<Divider sx={{ my: 1 }} />

			<Typography
				fontSize={18}
				fontWeight={600}
				sx={{
					mx: 1,
				}}
			>
				Gợi ý
			</Typography>
			<Box display="flex" flexDirection="column" maxHeight="100%" overflow="auto" flex={1}>
				{listSuggestions.map((action, index) => (
					<Box
						key={index}
						display="flex"
						alignItems="center"
						sx={{
							p: '8px',
							cursor: 'pointer',
							'&:hover': {
								backgroundColor: '#1877f22f',
							},
							borderRadius: '8px',
						}}
						onClick={action.onClick}
					>
						<Avatar sx={{ mr: 1 }} src={action.avatar}>
							{getShortName(action.title)}
						</Avatar>

						<Typography variant="subtitle2">{action.title}</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
