export const switchConfig = {
	elementId: 'playground-switch',
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
			defaultValue: 'Enable notifications',
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
		{
			name: 'visual-aid',
			alternativeName: 'visualAid',
			label: 'Visual Aid',
			type: 'checkbox',
			defaultValue: false,
			description: 'Add additional icons to indicate active/inactive state.',
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
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			description:
				'The disabled attribute can be set to keep a user from clicking on the form element.',
			showInPlayground: true,
		},

		// Hidden properties
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			description: 'Change the variant of the label to float or hidden',
			options: [
				{ value: 'above', label: 'Above', default: true },
				{ value: 'floating', label: 'Floating' },
			],
			showInPlayground: false,
		},
		{
			name: 'validation',
			label: 'Validation',
			type: 'select',
			description:
				'Marks an input element as invalid (red) / valid (green) / no-validation (grey).',
			options: [
				{ value: 'invalid', label: 'Invalid' },
				{ value: 'valid', label: 'Valid' },
				{ value: 'no-validation', label: 'No Validation', default: true },
			],
			showInPlayground: false,
		},
		{
			name: 'required',
			label: 'Required',
			type: 'checkbox',
			defaultValue: false,
			description:
				'When the required attribute specified, the user will be required to fill the form element before submitting the form.',
			showInPlayground: false,
		},
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
			name: 'message',
			label: 'Message',
			type: 'text',
			defaultValue: '',
			description: 'Optional helper message for form components',
			showInPlayground: false,
		},
		{
			name: 'invalidMessage',
			alternativeName: 'invalid-message',
			label: 'Invalid Message',
			type: 'text',
			defaultValue: '',
			description: 'Helper message for invalid form components',
			showInPlayground: false,
		},
		{
			name: 'validMessage',
			alternativeName: 'valid-message',
			label: 'Valid Message',
			type: 'text',
			defaultValue: '',
			description: 'Helper message for valid form components',
			showInPlayground: false,
		},
		{
			name: 'show-message',
			alternativeName: 'showMessage',
			label: 'Show Message',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enables or disables the visibility of the message.',
			showInPlayground: false,
		},
		{
			name: 'message-icon',
			alternativeName: 'messageIcon',
			type: 'text',
			label: 'Message Icon',
			description: 'Set/overwrite icon for helper message for form components',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'icon-leading',
			alternativeName: 'iconLeading',
			type: 'text',
			label: 'Icon Leading',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'icon',
			label: 'Icon',
			type: 'text',
			defaultValue: '',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
			showInPlayground: false,
		},
		{
			name: 'icon-trailing',
			alternativeName: 'iconTrailing',
			type: 'text',
			label: 'Icon Trailing',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
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
	],
};
