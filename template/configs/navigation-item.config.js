export const navigationItemConfig = {
	component: 'DBNavigationItem',
	elementId: 'demo-navigation-item',
	defaultText: 'Navigation Item',
	useAriaDisabled: true,
	slots: [
		{
			name: 'children',
			description: 'Default slot for the navigation item content (typically an anchor element)',
		},
		{
			name: 'subNavigation',
			description: 'React-specific property to pass in a slot for sub-navigation',
		},
	],
	events: [
		{
			name: 'click / onClick',
			type: '---',
		},
	],
	properties: [
		{
			name: 'text',
			description: 'Alternative for default slot/children.',
			type: 'text',
			defaultValue: 'Navigation Item',
			label: 'Text',
			showInPlayground: true,
		},
		{
			name: 'width',
			description:
				'Width of the component. Auto width based on children size, full width based on parent elements width.',
			type: 'select',
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'full', label: 'Full' },
			],
			defaultValue: 'auto',
			label: 'Width',
			showInPlayground: true,
		},
		{
			name: 'icon',
			description:
				'Define an icon by its identifier (like e.g. user, compare to Icons) to get displayed in front of the elements content.',
			type: 'text',
			defaultValue: '',
			label: 'Icon',
			showInPlayground: true,
		},
		{
			name: 'show-icon',
			description: 'Enables or disables the visibility of the icon.',
			type: 'checkbox',
			defaultValue: true,
			label: 'Show Icon',
			showInPlayground: true,
		},
		{
			name: 'active',
			description: 'Alternative indicator for active navigation item (bold font).',
			type: 'checkbox',
			defaultValue: false,
			label: 'Active',
			showInPlayground: true,
		},
		{
			name: 'wrap',
			description:
				'Determines whether the text should wrap when its parent container is too small.',
			type: 'checkbox',
			defaultValue: false,
			label: 'Wrap',
			showInPlayground: false,
		},
		{
			name: 'disabled',
			description: 'The disabled attribute can be set to keep a user from clicking on the item.',
			type: 'checkbox',
			defaultValue: false,
			label: 'Disabled',
			showInPlayground: true,
		},
		{
			name: 'sub-navigation-expanded / subNavigationExpanded',
			description:
				'This is for mobile navigation only, if it is set the sub-navigation is a static overlay',
			type: 'boolean | string',
			defaultValue: undefined,
			showInPlayground: false,
		},
		{
			name: 'id',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
			type: 'string',
			defaultValue: undefined,
			showInPlayground: false,
		},
		{
			name: 'className',
			description: 'React specific for adding className to the component.',
			type: 'string',
			defaultValue: undefined,
			showInPlayground: false,
		},
		{
			name: 'back-button-id / backButtonId',
			description: 'The backButtonId attribute changes the id inside the back button.',
			type: 'string',
			defaultValue: undefined,
			showInPlayground: false,
		},
		{
			name: 'back-button-text / backButtonText',
			description: 'The backButtonText attribute changes the text inside the back button.',
			type: 'string',
			defaultValue: undefined,
			showInPlayground: false,
		},
	],
};
