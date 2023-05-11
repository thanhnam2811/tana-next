// eslint-disable-next-line @typescript-eslint/no-var-requires
const removeImports = require('next-remove-imports')();

module.exports = (phase, { defaultConfig }) =>
	removeImports({
		...defaultConfig,
	});
