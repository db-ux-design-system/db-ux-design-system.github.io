export const cardConfig = {
	elementId: 'demo-card',
	defaultText: 'Card content goes here',
	defaultProps: {
		id: 'demo-card',
		behavior: 'static',
		elevationLevel: '1',
		spacing: 'medium',
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	properties: [
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
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			defaultValue: 'static',
			description: 'Makes the card interactive',
			options: [
				{ value: 'static', label: 'Static', default: true },
				{ value: 'interactive', label: 'Interactive' },
			],
			showInPlayground: true,
		},
		{
			name: 'elevation-level / elevationLevel',
			label: 'Elevation Level',
			type: 'select',
			defaultValue: '1',
			description:
				'Changes the elevation of the card which is equal to basic-background-level',
			options: [
				{ value: '1', label: '1', default: true },
				{ value: '2', label: '2' },
				{ value: '3', label: '3' },
			],
			showInPlayground: true,
		},
		{
			name: 'spacing',
			label: 'Spacing',
			type: 'select',
			defaultValue: 'medium',
			description: 'The spacing attribute changes the padding of the component.',
			options: [
				{ value: 'none', label: 'None' },
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'large', label: 'Large' },
			],
			showInPlayground: true,
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
