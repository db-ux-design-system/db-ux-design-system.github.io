export const sectionConfig = {
	elementId: 'demo-section',
	defaultText: 'Section content goes here',
	defaultProps: {
		spacing: 'medium',
		width: 'full',
	},
	properties: [
		{
			name: 'spacing',
			label: 'Spacing',
			type: 'select',
			defaultValue: 'medium',
			description: 'Controls the padding of the section.',
			options: [
				{ label: 'None', value: 'none', default: false },
				{ label: 'Small', value: 'small', default: false },
				{ label: 'Medium', value: 'medium', default: true },
				{ label: 'Large', value: 'large', default: false },
			],
		},
		{
			name: 'width',
			label: 'Width',
			type: 'select',
			defaultValue: 'full',
			description: 'Set max width for the component.',
			options: [
				{ label: 'Full', value: 'full', default: true },
				{ label: 'Small', value: 'small', default: false },
				{ label: 'Medium', value: 'medium', default: false },
				{ label: 'Large', value: 'large', default: false },
			],
			showInPlayground: false,
		},
		{
			name: 'id',
			label: 'ID',
			type: 'text',
			defaultValue: '',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
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
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
};
