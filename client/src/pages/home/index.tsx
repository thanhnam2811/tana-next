import HomePage from '@modules/home/pages/HomePage';
import { useAuth } from '@modules/auth/hooks';
import SEO from '@common/components/SEO';
import LandingPage from '@modules/home/pages/LandingPage';

export default function Home() {
	const { authUser } = useAuth();
	return (
		<>
			<SEO title="TaNa - Kết nối và sáng tạo" />

			{authUser ? <HomePage /> : <LandingPage />}
		</>
	);
}
