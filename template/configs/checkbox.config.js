export const checkboxConfig = {
	elementId: 'playground-checkbox',
	defaultProps: {
		checked: false,
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	events: [
		{
			name: 'change / onChange',
			type: '---',
		},
		{
			name: 'blur / onBlur',
			type: '---',
		},
		{
			name: 'focus / onFocus',
			type: '---',
		},
	],
	properties: [
		// Content
		{
			name: 'label',
			label: 'Label',
			type: 'text',
			defaultValue: 'Accept terms',
			description: 'The label attribute specifies the caption of the form element.',
			showInPlayground: true,
		},
		{
			name: 'show-label',
			alternativeName: 'showLabel',
			label: 'Show Label',
			type: 'checkbox',
			defaultValue: true,
			description: 'Enables/disables the visibility of the label',
			showInPlayground: true,
		},

		// Appearance
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			description:
				'The size attribute changes the font-size and other related sizes of the component.',
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
			],
			showInPlayground: true,
		},

		// States
		{
			name: 'checked',
			label: 'Checked',
			type: 'checkbox',
			defaultValue: false,
			description: 'Define the radio or checkbox elements checked state',
			showInPlayground: true,
		},
		{
			name: 'indeterminate',
			label: 'Indeterminate',
			type: 'checkbox',
			defaultValue: false,
			description: 'Define an indeterminate state of a checkbox',
			showInPlayground: true,
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			description:
				'The disabled attribute can be set to keep a user from clicking on the form element.',
			showInPlayground: true,
		},
		{
			name: 'required',
			label: 'Required',
			type: 'checkbox',
			defaultValue: false,
			description:
				'When the required attribute specified, the user will be required to fill the form element before submitting the form.',
			showInPlayground: true,
		},

		// Validation
		{
			name: 'validation',
			label: 'Validation',
			type: 'select',
			description: 'Marks an input element as invalid (red) / valid (green) / no-validation (grey)',
			options: [
				{ value: 'no-validation', label: 'No Validation', default: true },
				{ value: 'invalid', label: 'Invalid' },
				{ value: 'valid', label: 'Valid' },
			],
			showInPlayground: true,
		},
		{
			name: 'invalidMessage',
			alternativeName: 'invalid-message',
			label: 'Invalid Message',
			type: 'text',
			defaultValue: 'Please enter an invalid message',
			description: 'Helper message for invalid form components',
			showInPlayground: true,
			dependsOn: { prop: 'validation', value: 'invalid' },
		},
		{
			name: 'validMessage',
			alternativeName: 'valid-message',
			label: 'Valid Message',
			type: 'text',
			defaultValue: 'Please enter a valid message',
			description: 'Helper message for valid form components',
			showInPlayground: true,
			dependsOn: { prop: 'validation', value: 'valid' },
		},

		// Message
		{
			name: 'show-message',
			alternativeName: 'showMessage',
			label: 'Show Message',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enables or disables the visibility of the message.',
			showInPlayground: true,
			dependsOn: { prop: 'validation', value: 'no-validation' },
		},
		{
			name: 'message',
			label: 'Message',
			type: 'text',
			defaultValue: 'Message',
			description: 'Optional helper message for form components',
			showInPlayground: true,
			dependsOn: 'show-message',
		},

		// Hidden properties
		{
			name: 'show-required-asterisk',
			alternativeName: 'showRequiredAsterisk',
			label: 'Show Required Asterisk',
			type: 'checkbox',
			defaultValue: false,
			description:
				"This attribute allows to specify whether a form field which is marked as required will show a visual indicator (an asterisk '*').",
			showInPlayground: false,
		},
		{
			name: 'messageIcon',
			alternativeName: 'message-icon',
			type: 'text',
			label: 'Message Icon',
			description: 'Set/overwrite icon for helper message for form components',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'className',
			type: 'text',
			label: 'Class Name',
			description: 'React specific for adding className to the component.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			description:
				"The name attribute gives the name of the form control, as used in form submission and in the form element's elements object.",
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'value',
			type: 'text',
			label: 'Value',
			description: 'The value property is to receive results from the native form element.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'ariaDescribedBy',
			alternativeName: 'aria-described-by',
			type: 'text',
			label: 'Aria Described By',
			description: 'Overwrites auto handling for aria-describedby.',
			defaultValue: '',
			showInPlayground: false,
		},
	],
};
