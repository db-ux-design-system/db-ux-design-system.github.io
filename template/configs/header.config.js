export const headerConfig = {
	elementId: 'playground-header',
	defaultText: '',
	defaultProps: {
		id: 'playground-header',
	},
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
		{
			name: 'metaNavigation',
			description:
				'Slot to pass in a meta navigation. Desktop: Above the regular header. Mobile: Inside the drawer',
		},
		{
			name: 'secondaryAction',
			description:
				'Slot to pass one or more elements like DBButton (e.g. profile, language, etc.) as secondary action. Desktop: Shown separated by divider at the end of the header. Mobile: Shown inside the drawer at the bottom.',
		},
		{
			name: 'brand',
			description: 'Slot to pass in the DBBrand component',
		},
		{
			name: 'primaryAction',
			description:
				'Slot to pass one or more elements like DBButton (e.g. search) as primary action. Desktop: Shown next to the main-navigation. Mobile: Shown next to the brand',
		},
	],
	events: [
		{
			name: 'toggle / onToggle',
			type: '---',
		},
	],
	properties: [
		{
			name: 'force-mobile / forceMobile',
			label: 'Force Mobile',
			type: 'checkbox',
			defaultValue: false,
			description:
				"Forces the header to use mobile layout for desktop as well. You should only use this setting if you really can't provide a smaller navigation. Overwrite size of the drawer with '--db-drawer-max-width: xxx'",
			showInPlayground: false,
		},
		{
			name: 'drawer-open / drawerOpen',
			label: 'Drawer Open',
			type: 'checkbox',
			defaultValue: false,
			description: 'Open/closes the drawer for mobile header or if forceMobile is true.',
			showInPlayground: false,
		},
		{
			name: 'width',
			label: 'Width',
			type: 'select',
			description: 'Set max width for the component',
			options: [
				{ value: 'full', label: 'Full' },
				{ value: 'medium', label: 'Medium' },
				{ value: 'large', label: 'Large' },
				{ value: 'small', label: 'Small' },
			],
			showInPlayground: false,
		},
		{
			name: 'close-button-id / closeButtonId',
			label: 'Close Button ID',
			type: 'text',
			defaultValue: '',
			description: 'The closeButtonId attribute changes the id inside the close button.',
			showInPlayground: false,
		},
		{
			name: 'close-button-text / closeButtonText',
			label: 'Close Button Text',
			type: 'text',
			defaultValue: '',
			description: 'The closeButtonText attribute changes the text inside the close button.',
			showInPlayground: false,
		},
		{
			name: 'burger-menu-label / burgerMenuLabel',
			label: 'Burger Menu Label',
			type: 'text',
			defaultValue: '',
			description: 'This attribute sets the label for the burger menu button for mobile headers.',
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
