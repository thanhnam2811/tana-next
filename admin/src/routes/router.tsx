import LoginPage from '@/modules/auth/pages/LoginPage';
import Layout from '@/modules/layout/components/Layout';
import layoutData from '@/modules/layout/data/layoutData';
import ILayoutData from '@/modules/layout/types/ILayoutData';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

const getRoute = (data: ILayoutData[] = layoutData) => {
	const routes: RouteObject[] = [];

	data.forEach((item) => {
		const route: RouteObject = {
			path: item.path,
			element: item.element,
		};

		if (item.children) {
			route.children = [
				{
					path: '',
					element: <Navigate to={item.children[0].path} replace />,
				},
			];

			route.children.push(...getRoute(item.children));
		}

		routes.push(route);
	});

	return routes;
};

const layoutRoutes = getRoute(layoutData);

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '',
				element: <Navigate to={layoutData[0].path} replace />,
			},
			...layoutRoutes,
		],
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/404',
		element: <div>404</div>,
	},
	{
		path: '*',
		element: <Navigate to="/404" replace />,
	},
]);
