import React, { forwardRef } from 'react';
import NavBar from './NavBar';
import Layout from '.';
import { MainProps } from '@layout/components/Main';

export const Container = forwardRef<HTMLElement, MainProps>((props, ref) => (
	<>
		<NavBar />

		<Layout.Main {...props} ref={ref} />
	</>
));
