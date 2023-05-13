import { App as AntdApp, ConfigProvider, Spin, theme } from 'antd';
import viVn from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { authApi } from './api';
import { router } from './routes';
import { useAuthStore, useThemeStore } from './store';
dayjs.locale('vi');

function App() {
	const [loading, setLoading] = useState(true);
	const { login, logout } = useAuthStore();
	const { mode } = useThemeStore();

	// get current user
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await authApi.getProfile();
				if (data) login(data);
			} catch (error) {
				logout();
			}
			setLoading(false);
		};

		fetchUser();
	}, [login, logout]);

	if (loading)
		return (
			<Spin
				size="large"
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			/>
		);

	return (
		<ConfigProvider
			locale={viVn}
			theme={{
				token: {
					borderRadius: 12,
				},
				algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
			}}
			input={{ autoComplete: 'off' }}
			select={{ showSearch: true }}
		>
			<AntdApp>
				<RouterProvider router={router} />
			</AntdApp>
		</ConfigProvider>
	);
}

export default App;
