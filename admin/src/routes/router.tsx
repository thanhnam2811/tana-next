import Layout from '@layout/Layout';
import { layoutData, layoutRoutes } from '@layout/data';
import LoginPage from '@modules/auth/pages/LoginPage';
import { Navigate, createBrowserRouter } from 'react-router-dom';

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
