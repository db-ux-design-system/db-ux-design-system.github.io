export const buttonConfig = {
	component: 'DBButton',
	elementId: 'demo-button',
	textElementId: 'button-text',
	defaultText: 'Button',
	defaultProps: {
		size: 'medium',
		variant: 'outlined'
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	events: [
		{
			name: 'click / onClick',
			type: '---',
		},
	],
	properties: [
		// Content
		{
			name: 'text',
			type: 'text',
			label: 'Text',
			description: 'Alternative for default slot/children.',
			defaultValue: 'Button',
			showInPlayground: true
		},

		// Appearance
		{
			name: 'variant',
			type: 'select',
			label: 'Variant',
			description: 'Variant of the button. Use only 1 primary button on a page as CTA otherwise use one of the adaptive buttons.',
			defaultValue: 'outlined',
			showInPlayground: true,
			options: [
				{ value: 'outlined', label: 'Outlined', default: true },
				{ value: 'brand', label: 'Brand' },
				{ value: 'filled', label: 'Filled' },
				{ value: 'ghost', label: 'Ghost' }
			]
		},
		{
			name: 'size',
			type: 'select',
			label: 'Size',
			description: 'The size attribute changes the font-size and other related sizes of the component.',
			defaultValue: 'medium',
			showInPlayground: true,
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true }
			]
		},
		{
			name: 'width',
			type: 'select',
			label: 'Width',
			description: 'Width of the component. Auto width based on children size, full width based on parent elements width.',
			defaultValue: 'auto',
			showInPlayground: true,
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'full', label: 'Full' }
			]
		},

		// Icons
		{
			name: 'icon',
			type: 'text',
			label: 'Icon',
			description: 'Define an icon by its identifier to get displayed in the button.',
			defaultValue: '',
			showInPlayground: true
		},
		{
			name: 'icon-trailing',
			alternativeName: 'iconTrailing',
			type: 'text',
			label: 'Icon Trailing',
			description: 'Define an icon by its identifier to get displayed after the elements content.',
			defaultValue: '',
			showInPlayground: true
		},
		{
			name: 'no-text',
			alternativeName: 'noText',
			type: 'checkbox',
			label: 'No Text',
			description: 'Define the text next to the icon specified via the icon Property to get hidden.',
			defaultValue: false,
			showInPlayground: true
		},

		// States
		{
			name: 'disabled',
			type: 'checkbox',
			label: 'Disabled',
			description: 'The disabled attribute can be set to keep a user from clicking on the button.',
			defaultValue: false,
			showInPlayground: true
		},

		// Hidden properties
		{
			name: 'type',
			type: 'select',
			label: 'Type',
			description: 'The type attribute specifies the type of button.',
			defaultValue: 'button',
			showInPlayground: false,
			options: [
				{ value: 'button', label: 'Button', default: true },
				{ value: 'submit', label: 'Submit' },
				{ value: 'reset', label: 'Reset' }
			]
		},
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			description: 'ID of the component, generated automatically for some components as a fallback if unset.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'className',
			type: 'text',
			label: 'Class Name',
			description: 'React specific for adding className to the component.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'icon-leading',
			alternativeName: 'iconLeading',
			type: 'text',
			label: 'Icon Leading',
			description: 'Define an icon by its identifier to get displayed in front of the elements content.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'show-icon-leading',
			alternativeName: 'showIconLeading',
			type: 'checkbox',
			label: 'Show Icon Leading',
			description: 'Enables or disables the visibility of the leading icon.',
			defaultValue: false,
			showInPlayground: false
		},
		{
			name: 'show-icon',
			alternativeName: 'showIcon',
			type: 'checkbox',
			label: 'Show Icon',
			description: 'Enables or disables the visibility of the icon.',
			defaultValue: false,
			showInPlayground: false
		},
		{
			name: 'show-icon-trailing',
			alternativeName: 'showIconTrailing',
			type: 'checkbox',
			label: 'Show Icon Trailing',
			description: 'Enables or disables the visibility of the trailing icon.',
			defaultValue: false,
			showInPlayground: false
		},
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			description: 'The name attribute specifies a name attributes value for the button.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'form',
			type: 'text',
			label: 'Form',
			description: 'Associates the control with a form element.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'value',
			type: 'text',
			label: 'Value',
			description: 'The value attribute specifies an initial value for the button.',
			defaultValue: '',
			showInPlayground: false
		}
	]
};