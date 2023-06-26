import Layout from '@layout/Layout';
import { layoutData, layoutRoutes } from '@layout/data';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '@modules/auth/pages/LoginPage';
import UserDetail from '@modules/user/pages/UserDetail';
import ReportDetail from '@modules/report/pages/ReportDetail';

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
			{
				path: 'account',
				children: [
					{
						path: 'user',
						children: [
							{
								path: ':id',
								element: <UserDetail />,
							},
						],
					},
				],
			},
			{
				path: 'report',
				children: [
					{
						path: ':id',
						element: <ReportDetail />,
					},
				],
			},
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
