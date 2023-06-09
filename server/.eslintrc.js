module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: ['airbnb-base', 'prettier', 'plugin:import/recommended'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	ignorePatterns: ['node_modules/', '**/*.html', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.log'],
	plugins: ['prettier', 'jsdoc', 'import'],
	rules: {
		'no-console': 'off',
		'no-underscore-dangle': 'off',
		eqeqeq: 'off',
		'no-param-reassign': 'off',
		'no-unused-vars': 'warn',
		'class-methods-use-this': 'off',
		'consistent-return': 'off',
		'no-shadow': 'off',
		radix: 'off',
		'jsdoc/no-undefined-types': 'warn',
		'no-restricted-syntax': 'off',
		'no-plusplus': 'off',
	},
};
