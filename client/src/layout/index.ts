import { memo } from 'react';
import { Main } from './Main';
import { Sider } from './Sider';
import { Header } from './Header';
import { Content } from './Content';

const Layout = {
	Main: memo(Main),
	Sider: memo(Sider),
	Header: memo(Header),
	Content: memo(Content),
};

export default Layout;

export * from './withLayout';
