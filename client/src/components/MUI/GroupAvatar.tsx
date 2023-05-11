import React from 'react';
import { Box, Avatar, BoxProps } from '@mui/material';
import { randomString } from '@utils/common';

interface Props {
	listMember: any[];
	size?: number;
}

type Axis = {
	x: number;
	y: number;
};

const MAX_AVATAR = 5;
const DF_SIZE = 80;

export function GroupAvatar({ listMember, size = DF_SIZE, ...props }: Props & BoxProps) {
	let data = listMember.map(({ user }: any) => user).filter((user) => !!user?.profilePicture?.link);

	const avatarSize = (size * 2) / 3 - (size * data.length) / 16;

	if (data.length > MAX_AVATAR) data = data.slice(0, MAX_AVATAR);

	const rad = 360 / data.length;
	const unit = size / 2;
	const axisArr: Axis[] = data.map((_, index) => {
		const radian = (index * rad * Math.PI) / 180 + (Math.PI * (90 - rad / 2)) / 180;
		const x = (Math.cos(radian) * unit) / 2;
		const y = (Math.sin(radian) * unit) / 2;
		return { x, y };
	});

	// Show avatars in a circle box, avatar size is 40px
	return (
		<Box position="relative" width={size} height={size} bgcolor={'#e0e0e0'} borderRadius="50%" {...props}>
			{data.map((user: any, index) => (
				<Avatar
					key={randomString(20)}
					src={user.profilePicture?.link}
					sx={{
						position: 'absolute',
						top: unit - avatarSize / 2,
						left: unit - avatarSize / 2,
						transform: `translate(${axisArr[index].x}px, ${axisArr[index].y}px)`,
						transformOrigin: 'center',
						width: avatarSize,
						height: avatarSize,
						borderRadius: '50%',
						backgroundColor: '#fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 0 0 2px #fff',
					}}
				/>
			))}
		</Box>
	);
}
