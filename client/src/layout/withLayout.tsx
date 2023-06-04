import Layout from '@layout';
import { NextComponentType } from 'next';
import NavBar from './NavBar';

export function withLayout(Component: NextComponentType) {
	const Container: NextComponentType = (props: any) => (
		<>
			<NavBar />

			<Layout.Main>
				<Component {...props} />
			</Layout.Main>
		</>
	);

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Container.getInitialProps = Component.getInitialProps;
	}

	return Container;
}