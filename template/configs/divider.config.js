export const dividerConfig = {
	elementId: 'demo-divider',
	defaultText: '',
	defaultProps: {
		id: 'demo-divider',
		emphasis: 'weak',
		variant: 'horizontal',
	},
	codeExamples: {
		html: '<div class="db-divider" data-emphasis="weak" data-variant="horizontal"></div>',
		react: '<DBDivider emphasis="weak" variant="horizontal" />',
		angular: '<db-divider emphasis="weak" variant="horizontal"></db-divider>',
		vue: '<DBDivider emphasis="weak" variant="horizontal" />',
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	properties: [
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			defaultValue: 'horizontal',
			description: 'Changes the orientation of the divider.',
			options: [
				{ value: 'horizontal', label: 'Horizontal', default: true },
				{ value: 'vertical', label: 'Vertical' },
			],
			showInPlayground: true,
		},
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			defaultValue: 'weak',
			description:
				'The emphasis attribute divides in between a weak or strong importance.',
			options: [
				{ value: 'weak', label: 'Weak', default: true },
				{ value: 'strong', label: 'Strong' },
			],
			showInPlayground: true,
		},
		{
			name: 'margin',
			label: 'Margin',
			type: 'select',
			defaultValue: '_',
			description: 'Removes the margin of the divider.',
			options: [
				{ value: '_', label: 'Default', default: true },
				{ value: 'none', label: 'None' },
			],
			showInPlayground: true,
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
			name: 'width',
			label: 'Width',
			type: 'select',
			defaultValue: 'full',
			description:
				'Width of the component. Auto width based on children size, full width based on parent elements width.',
			options: [
				{ value: 'full', label: 'Full', default: true },
				{ value: 'auto', label: 'Auto' },
			],
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
