/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard'],
	plugins: ['stylelint-use-logical', '@double-great/stylelint-a11y', '@db-ux/core-stylelint'],
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
		'a11y/media-prefers-reduced-motion': true,
		'a11y/no-outline-none': true,
		'a11y/selector-pseudo-class-focus': true,
		'csstools/use-logical': ['always', { except: ['float'] }],
		'no-descending-specificity': null,
		'declaration-property-value-no-unknown': [
			true,
			{
				ignoreProperties: { 'mask-composite': ['source-in'] },
			},
		],
	},
};
