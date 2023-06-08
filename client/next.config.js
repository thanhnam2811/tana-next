// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require('next-remove-imports')();

module.exports = (phase, { defaultConfig }) =>
	removeImports({
		...defaultConfig,
		images: {
			domains: ['res.cloudinary.com', 'via.placeholder.com'],
		},
		env: {
			SERVER_URL: process.env.SERVER_URL,
			BASE_URL: process.env.BASE_URL,
		},
	});
