import React from 'react';
import { Avatar, Grid, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { Logo } from '@assets/logo';

export function LeftSide() {
	const router = useRouter();
	const handleLogoClick = () => router.push('/home');

	return (
		<Grid
			item
			xs="auto"
			sx={{
				display: {
					xs: 'none',
					sm: 'flex',
				},
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<IconButton onClick={handleLogoClick}>
				<Avatar alt="Logo" src={Logo.src} />
			</IconButton>
			{/* <SearchInput
				sx={{
					display: {
						xs: 'none',
						md: 'block',
					},
				}}
				placeholder={'Tìm kiếm'}
			/> */}
		</Grid>
	);
}
