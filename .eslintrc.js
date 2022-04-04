module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'semi': ['error', 'always'],
		'quotes': ['error', 'single'],
		'no-multi-spaces': 'error',
		'no-unused-vars': 'off' // 关闭校验未使用变量
	}
};
