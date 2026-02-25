/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard'],
	plugins: ['@double-great/stylelint-a11y', '@db-ux/core-stylelint', 'stylelint-use-logical'],
	rules: {
		'db-ux/use-spacings': [
			true,
			{
				allowCalc: true,
			},
		], // margins, paddings, gaps
		'db-ux/use-sizing': [
			true,
			{
				allowCalc: true,
				allow: {
					exact: ['var(--footer-height)'],
				},
			},
		], // height, width
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
