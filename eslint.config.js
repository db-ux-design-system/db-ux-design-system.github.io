import eslintPluginAstro from 'eslint-plugin-astro';
import dbUx from '@db-ux/core-eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: {
			'db-ux': dbUx,
		},
		rules: {
			...dbUx.configs.recommended.rules,
			// We use new shell, some rules can't be applied
			'db-ux/navigation-item-back-button-text-required': 'off',
			'db-ux/close-button-text-required': 'off',
		},
	},
];
