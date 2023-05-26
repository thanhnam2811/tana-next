module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: ['plugin:sonarjs/recommended', 'eslint:recommended'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['sonarjs'],
	rules: {
		'sonarjs/no-duplicate-string': 'off',
		'sonarjs/cognitive-complexity': 'off',
		'no-unused-vars': 'warn',
	},
};
