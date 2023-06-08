import { Navigate, RouteObject } from 'react-router-dom';
import { layoutData } from './layoutData';
import { ILayoutData } from '@layout/types';

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

export const layoutRoutes = getRoute();
