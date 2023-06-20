let config = {
	images: {
		domains: ['res.cloudinary.com', 'via.placeholder.com'],
	},
	env: {
		SERVER_URL: process.env.SERVER_URL,
		BASE_URL: process.env.BASE_URL,
	},
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require('next-remove-imports')();
config = removeImports({ ...config });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
config = withBundleAnalyzer({ ...config });

module.exports = config;
