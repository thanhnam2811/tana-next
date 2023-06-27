import removeImports from 'next-remove-imports';
import withBundleAnalyzer from '@next/bundle-analyzer';

const removeImportFunc = removeImports();

const withBundleAnalyzerFunc = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const config = {
	images: {
		domains: ['res.cloudinary.com', 'via.placeholder.com'],
	},
	env: {
		SERVER_URL: process.env.SERVER_URL,
		BASE_URL: process.env.BASE_URL,
	},
};

const constConfig = removeImportFunc(withBundleAnalyzerFunc(config));

export default constConfig;
