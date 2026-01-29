/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard'],
	plugins: ['@db-ux/core-stylelint'],
	rules: {
		'db-ux/use-spacings': [true], // margins, paddings, gaps
		'db-ux/use-border-width': [true], // border-width & border
		'db-ux/use-border-radius': [true], // border-radius
		'db-ux/use-border-color': [true], // border-color & border
		'no-descending-specificity': null,
		'declaration-property-value-no-unknown': [
			true,
			{
				ignoreProperties: { 'mask-composite': ['source-in'] },
			},
		],
	},
};
