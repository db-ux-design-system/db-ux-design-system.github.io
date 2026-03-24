export const tagConfig = {
	elementId: 'playground-tag',
	defaultText: 'Tag',
	defaultProps: {
		behavior: 'static',
		semantic: 'adaptive',
		emphasis: 'weak',
		id: 'playground-tag',
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
		{
			name: 'content',
			description: 'Default slot which is used to pass in additional content.',
		},
	],
	events: [
		{
			name: 'remove / onRemove',
			type: '---',
		},
	],
	properties: [
		// Content
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Tag',
			description: 'Alternative for children to set content as property.',
		},
		{
			name: 'text-2',
			label: 'Text (Tag 2)',
			type: 'text',
			defaultValue: 'Tag 2',
			description: 'Text for the second tag (checkbox/radio).',
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		// Appearance
		{
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			description: 'Defines the behavior of the component',
			options: [
				{ value: 'static', label: 'Static', default: true },
				{ value: 'interactive', label: 'Interactive' },
				{ value: 'removable', label: 'Removable' },
			],
		},
		{
			name: 'children',
			label: 'Children',
			type: 'select',
			description: 'Defines the interactive behavior of the component',
			options: [
				{ value: 'button-link', label: 'Button/Link', default: true },
				{ value: 'checkbox', label: 'Checkbox' },
				{ value: 'radio', label: 'Radio' },
			],
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			description: 'The disabled attribute can be set to keep a user from clicking on the tag.',
			showInPlayground: true,
		},
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
				{ value: 'weak', label: 'Weak', default: true },
				{ value: 'strong', label: 'Strong' },
			],
		},

		// Hidden properties
		{
			name: 'show-icon / showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enables or disables the visibility of the icon.',
			showInPlayground: true,
		},
		{
			name: 'icon',
			label: 'Icon',
			type: 'text',
			defaultValue: 'star',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
			dependsOn: { prop: 'show-icon / showIcon', value: 'true' },
		},
		{
			name: 'show-check-state / showCheckState',
			label: 'Show Check State',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enable/Disable icon for checkbox/radio inside tag.',
			showInPlayground: true,
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'no-text / noText',
			label: 'No Text',
			type: 'checkbox',
			defaultValue: false,
			description: 'Define the text next to the icon to get hidden.',
			showInPlayground: true,
		},

		{
			name: 'remove-button / removeButton',
			label: 'Remove Button',
			type: 'text',
			defaultValue: '',
			description: 'The removeButton attribute shows the cancel button.',
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
};
