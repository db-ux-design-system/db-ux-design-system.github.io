export const navigationConfig = {
	component: 'DBNavigation',
	elementId: 'demo-navigation',
	defaultProps: {},
	slots: [
		{ name: 'children', description: 'Default slot' },
	],
	properties: [
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			description: 'ID of the component, generated automatically for some components as a fallback if unset.',
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
	],
};
