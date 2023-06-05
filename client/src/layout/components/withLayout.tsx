import Layout from '@layout/components';
import { NextComponentType } from 'next';
import NavBar from './NavBar';

export function withLayout(Component: NextComponentType) {
	const Container: NextComponentType = (props: React.ComponentProps<typeof Component>) => (
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
