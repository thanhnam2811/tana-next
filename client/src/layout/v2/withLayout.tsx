import { Layout, theme } from 'antd';
import { NextComponentType } from 'next';
import styles from './Layout.module.scss';
import { NavBar } from './NavBar';

export function withLayout(Component: NextComponentType) {
	const Container: NextComponentType = (props: any) => {
		const {
			token: { colorBgContainer },
		} = theme.useToken();

		return (
			<Layout style={{ height: '100vh', overflowX: 'hidden' }}>
				<Layout.Header style={{ backgroundColor: colorBgContainer }} className={styles.header}>
					<NavBar />
				</Layout.Header>

				<Component {...props} />
			</Layout>
		);
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Container.getInitialProps = Component.getInitialProps;
	}

	return Container;
}
