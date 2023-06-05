import React from 'react';
import NavBar from './NavBar';
import Layout from '.';

interface Props {
	children: React.ReactNode;
}

export function Container({ children }: Props) {
	return (
		<>
			<NavBar />

			<Layout.Main>{children}</Layout.Main>
		</>
	);
}
