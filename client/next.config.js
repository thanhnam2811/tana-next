// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require('next-remove-imports')();

module.exports = (phase, { defaultConfig }) =>
	removeImports({
		...defaultConfig,
		images: {
			domains: ['res.cloudinary.com'],
		},
		env: {
			SERVER_URL: process.env.SERVER_URL,
		},
	});
