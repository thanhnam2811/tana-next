import React from 'react';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import Lottie from 'react-lottie-player';
import styles from './MessageArea.module.css';

interface Props {
	typingList: any[];
}

export const TypingMessage = ({ typingList }: Props) => (
	<Grid
		className={styles['message-container']}
		component="div"
		container
		width="100%"
		gap="8px"
		px={2}
		justifyContent="flex-start"
	>
		<Grid item xs={12}>
			<Typography variant="body2" color="textSecondary" fontSize={12}>
				{typingList.map((mem) => mem?.nickname || mem?.user?.fullname).join(', ')} đang nhập tin nhắn...
			</Typography>
		</Grid>
		{/* Avatar */}

		<Grid component="div" item xs="auto" display="flex" flexDirection="column" justifyContent="flex-end">
			<Avatar
				sx={{
					width: '32px',
					height: '32px',
					background: 'transparent',
				}}
			>
				<Lottie
					path="https://assets8.lottiefiles.com/packages/lf20_9e8yoqkm.json"
					speed={1}
					loop
					play
					style={{
						width: '32px',
						height: '32px',
					}}
				/>
			</Avatar>
		</Grid>

		{/* Message */}
		<Grid component="div" item xs="auto" width="fit-content !important" maxWidth="80% !important">
			<Box
				position="relative"
				borderRadius="16px 16px 16px 4px"
				py="8px"
				px="12px"
				sx={{
					backgroundColor: 'background.default',
					color: 'black',
					animation: 'sending-message 1s infinite',
				}}
			>
				<Lottie
					path="https://assets8.lottiefiles.com/temp/lf20_vKPgdY.json"
					speed={1}
					loop
					play
					style={{ width: '100%', height: '16px' }}
				/>
			</Box>
		</Grid>
	</Grid>
);
