module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'next',
		'next/core-web-vitals',
		'prettier',
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'no-unused-vars': 'off', // Warn about unused variables
		'no-console': 'off', // Warn about console statements
		'arrow-body-style': ['warn', 'as-needed'], // Prefer `() => value` over `() => { return value }`
		'react/self-closing-comp': ['warn', { component: true, html: true }], // Prefer `<Foo />` over `<Foo></Foo>`
		'no-var': 'error', // Prefer `const` or `let` over `var` (ES6)
		'prefer-const': 'warn', // Prefer `const` over `let` if a variable is never reassigned
		'no-const-assign': 'error', // Error if a `const` variable is reassigned
		'@typescript-eslint/no-explicit-any': 'off', // Allow `any` type
		'no-empty-pattern': 'warn', // Warn about empty destructuring patterns
		'react-hooks/exhaustive-deps': 'off', // Disable exhaustive-deps rule
		'@typescript-eslint/no-non-null-assertion': 'off', // Allow non-null assertions
		'react/display-name': 'off', // Allow missing display name in function components
	},
};
