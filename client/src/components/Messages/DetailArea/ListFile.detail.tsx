import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { HiDownload } from 'react-icons/hi';
import { useInfiniteFetcher } from '@hooks';
import { getFileIcon } from '@utils/data';
import { getTimeAgo } from '@utils/common';
import Image from 'next/image';

interface Props {
	conversation: any;
}

const ListFiles = ({ conversation }: Props) => {
	const fileFetcher = useInfiniteFetcher(`conversations/${conversation?._id}/files/other`);

	const idRef = useRef<any>(null);
	useEffect(() => {
		idRef.current = conversation?._id;
		if (conversation?._id) fileFetcher.reload();
	}, [conversation?._id]);

	if (fileFetcher.fetching) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" m={2}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Stack spacing={1}>
			{fileFetcher.data.map((file: any) => (
				<Stack
					key={file._id}
					spacing={1}
					direction="row"
					alignItems="center"
					sx={{
						borderRadius: '8px',
						border: '1px solid #e0e0e0',
						padding: '8px',
						position: 'relative',
						'&:hover a': {
							opacity: 1,
							pointerEvents: 'all',
						},
					}}
				>
					<Image src={getFileIcon(file)} alt={file.originalname} width={40} height={40} />

					<Stack spacing={1} flex={1} overflow="hidden">
						<Typography
							fontSize={14}
							fontWeight={700}
							overflow="hidden"
							textOverflow="ellipsis"
							whiteSpace="nowrap"
						>
							{file.originalname}
						</Typography>
						<Typography fontSize={12} fontWeight={500}>
							<b>{file.creator?.fullname}</b> đã gửi vào <b>{getTimeAgo(file.createdAt)}</b>
						</Typography>
					</Stack>

					{/*	Dowload file */}
					<IconButton
						component="a"
						href={file.link}
						download
						sx={{
							position: 'absolute',
							right: '8px',
							top: 0,
							bottom: 0,
							opacity: 0,
							pointerEvents: 'none',
							transition: 'all 0.3s ease-in-out',
							height: 'fit-content',
							padding: '8px',
							borderRadius: '50%',
							border: '1px solid #e0e0e0',
							m: 'auto !important',
							color: 'primary.main',
							backgroundColor: '#fff',
							'&:hover': {
								backgroundColor: 'primary.main',
								color: '#fff',
								transform: 'scale(1.1)',
							},
						}}
					>
						<HiDownload size={20} />
					</IconButton>
				</Stack>
			))}

			{fileFetcher.data.length === 0 && !fileFetcher.fetching && (
				<Typography textAlign="center" color="text.secondary">
					Chưa có file nào được gửi
				</Typography>
			)}
		</Stack>
	);
};

export default ListFiles;
