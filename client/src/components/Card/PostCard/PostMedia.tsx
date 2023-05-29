import { IMedia } from '@interfaces/common';
import { CloseRounded } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { Image } from 'antd';
import React from 'react';

// Layout for image
const getColumnSize = (index: number, size: number) => {
	if (size === 1) return 12;
	if (size === 2 || size === 4) return 6;
	if (size === 5) return index < 2 ? 6 : 4; // 6, 6, 4, 4, 4
	return 4;
};

interface Props {
	media: IMedia[];
	showAll?: boolean;
	onDelete?: (id: string) => void;
}

export function PostMedia({ media, showAll = false, onDelete }: Props) {
	const dislayMedia = showAll ? media : media?.slice(0, 6);

	return (
		<Image.PreviewGroup>
			<Grid container spacing={1} sx={{ mt: 1 }} justifyContent="center">
				{dislayMedia.map(({ _id, link }, index) => (
					<Grid
						item
						xs={getColumnSize(index, media?.length)}
						key={_id}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Box position="relative">
							<Image
								src={link}
								alt="media"
								style={{
									objectFit: 'cover',
									maxWidth: '100%',
									maxHeight: '60vh',
								}}
							/>

							{/*	Overlayer last image if image.length > 6 */}
							{!showAll && media?.length > 6 && index === 5 && (
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
										backgroundColor: 'rgba(0,0,0,0.5)',
										borderRadius: '16px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Typography color="white">+{media?.length - 6}</Typography>
								</Box>
							)}

							{/* Button delete image */}
							{onDelete && (
								<IconButton
									sx={{ position: 'absolute', top: 0, right: 0 }}
									onClick={() => onDelete(_id)}
									color="error"
									size="small"
								>
									<CloseRounded />
								</IconButton>
							)}
						</Box>
					</Grid>
				))}
			</Grid>
		</Image.PreviewGroup>
	);
}
