export const badgeConfig = {
	elementId: 'playground-badge',
	defaultText: 'Badge',
	defaultProps: {
		placement: 'inline',
		semantic: 'adaptive',
		size: 'medium',
		emphasis: 'strong',
	},
	properties: [
		// Content
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Badge',
			description: 'Alternative for default slot/children.',
		},
		// Appearance
		{
			name: 'semantic',
			label: 'Semantic',
			type: 'select',
			description: 'The semantic defines the default variants for most components.',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'neutral', label: 'Neutral' },
				{ value: 'critical', label: 'Critical' },
				{ value: 'informational', label: 'Informational' },
				{ value: 'warning', label: 'Warning' },
				{ value: 'successful', label: 'Successful' },
			],
		},
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			description: 'The emphasis attribute divides in between a weak or strong importance.',
			options: [
				{ value: 'weak', label: 'Weak' },
				{ value: 'strong', label: 'Strong', default: true },
			],
		},
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			description: 'The size attribute changes the font-size and other related sizes of the component.',
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
			],
		},
		{
			name: 'placement',
			label: 'Placement',
			type: 'select',
			description: 'The placement attributes corner-* values change the position to absolute and adds a transform based on the placement.',
			options: [
				{ value: 'inline', label: 'Inline', default: true },
				{ value: 'corner-top-left', label: 'Corner Top Left' },
				{ value: 'corner-top-right', label: 'Corner Top Right' },
				{ value: 'corner-center-left', label: 'Corner Center Left' },
				{ value: 'corner-center-right', label: 'Corner Center Right' },
				{ value: 'corner-bottom-left', label: 'Corner Bottom Left' },
				{ value: 'corner-bottom-right', label: 'Corner Bottom Right' },
			],
		},
		// Hidden properties
		{
			name: 'label',
			label: 'Label',
			type: 'text',
			defaultValue: '',
			description: 'Describes the badge for a11y if you use placement attribute with corner-*',
			showInPlayground: false,
		},
		{
			name: 'id',
			label: 'ID',
			type: 'text',
			defaultValue: '',
			description: 'ID of the component, generated automatically for some components as a fallback if unset.',
			showInPlayground: false,
		},
		{
			name: 'className',
			label: 'Class Name',
			type: 'text',
			defaultValue: '',
			description: 'React specific for adding className to the component.',
			showInPlayground: false,
		},
	],
};
