import ProviderAuthPage, { ProviderAuthPageProps } from '@modules/auth/pages/ProviderAuthPage';
import { authProviders } from '@modules/auth/data';
import { GetStaticPaths, GetStaticProps } from 'next';

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: authProviders.map((provider) => ({ params: { providerId: provider.id } })),
	fallback: false,
});

export const getStaticProps: GetStaticProps<ProviderAuthPageProps> = async ({ params }) => {
	const { providerId, accessToken, refreshToken } = params as { [key: string]: string };

	const provider = authProviders.find((p) => p.id === providerId);
	if (!provider) return { redirect: { destination: '/auth/login', permanent: false } };

	return {
		props: { provider, accessToken, refreshToken },
	};
};

export default ProviderAuthPage;
