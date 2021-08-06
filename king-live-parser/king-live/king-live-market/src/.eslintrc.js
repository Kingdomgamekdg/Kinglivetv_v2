module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: [
		'plugin:@typescript-eslint/recommended'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		'indent': [
			'error',
			4
		],
		'padded-blocks': [
			"error",
			{ "classes": "always" }
		],
		'semi': [
			'error',
			'always'
		]
	}
}
