export const backdropConfig = {
	elementId: 'demo-backdrop',
	defaultText: 'Backdrop',
	defaultProps: {
		emphasis: 'strong',
	},
	properties: [
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			defaultValue: 'strong',
			options: [
				{ label: 'Strong', value: 'strong', default: true },
				{ label: 'Weak', value: 'weak', default: false },
			],
		},
		{
			name: 'open',
			label: 'Show Backdrop',
			type: 'checkbox',
			defaultValue: false,
		},
	],
};
