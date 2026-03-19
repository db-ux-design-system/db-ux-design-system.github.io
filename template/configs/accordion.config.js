export const accordionConfig = {
	elementId: 'demo-accordion',
	defaultText: 'Accordion',
	defaultProps: {
		behavior: 'multiple',
		variant: 'divider',
	},
	properties: [
		{
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			defaultValue: 'multiple',
			options: [
				{ label: 'Multiple', value: 'multiple', default: true },
				{ label: 'Single', value: 'single', default: false },
			],
		},
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			defaultValue: 'divider',
			options: [
				{ label: 'Divider', value: 'divider', default: true },
				{ label: 'Card', value: 'card', default: false },
			],
		},
	],
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
};
