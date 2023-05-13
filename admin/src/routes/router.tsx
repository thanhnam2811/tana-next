import { Layout, layoutData, LayoutData } from '@/layout';
import Login from '@/pages/login/Login';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

const getRoute = (data: LayoutData[]) => {
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
		element: <Login />,
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
