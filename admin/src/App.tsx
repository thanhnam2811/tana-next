import { App as AntdApp, ConfigProvider, Spin, theme } from 'antd';
import viVn from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useTheme } from '@layout/hooks';
import { useAuth } from '@modules/auth/hooks';

dayjs.locale('vi');

function App() {
	const [loading, setLoading] = useState(true);
	const { logout, getProfile } = useAuth();
	const { mode } = useTheme();

	// get current user
	useEffect(() => {
		getProfile()
			.catch(logout)
			.finally(() => setLoading(false));
	}, [getProfile, logout]);

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
