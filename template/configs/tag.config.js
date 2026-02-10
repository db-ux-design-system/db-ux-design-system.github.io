export const tagConfig = {
	properties: [
		{
			name: 'behavior',
			description:
				'Defines the behavior of the component:\n- static: default behavior without remove button\n- removable: add a remove button at the end of the tag',
			type: 'union',
			options: '"static" | "removable" | string',
		},
		{
			name: 'semantic',
			description: 'The semantic defines the default variants for most components.',
			type: 'union',
			options:
				'"adaptive" | "neutral" | "critical" | "informational" | "warning" | "successful"',
		},
		{
			name: 'emphasis',
			description: 'The emphasis attribute divides in between a weak or strong importance.',
			type: 'union',
			options: '"weak" | "strong"',
		},
		{
			name: 'icon',
			description:
				'Define an icon by its identifier (like e.g. user, compare to Icons) to get displayed in front of the elements content.',
			type: 'IconTypes',
		},
		{
			name: 'show-icon / showIcon',
			description:
				'Enables or disables the visibility of the icon. The default value depends on the component.\nFor many components this property is optional to reflect Figma properties.',
			type: 'union',
			options: 'boolean | string',
		},
		{
			name: 'show-check-state / showCheckState',
			description: 'Enable/Disable icon for checkbox/radio inside tag.',
			type: 'union',
			options: 'boolean | string',
		},
		{
			name: 'no-text / noText',
			description:
				'Define the text next to the icon specified via the icon Property to get hidden.',
			type: 'union',
			options: 'boolean | string',
		},
		{
			name: 'overflow',
			description:
				'The overflow attribute sets a max-width and longer text will be dotted.',
			type: 'union',
			options: 'boolean | string',
		},
		{
			name: 'text',
			description: 'Alternative for children to set content as property.',
			type: 'string',
		},
		{
			name: 'remove-button / removeButton',
			description: 'The removeButton attribute shows the cancel button.',
			type: 'string',
		},
		{
			name: 'id',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
			type: 'string',
		},
		{
			name: 'className',
			description: 'React specific for adding className to the component.',
			type: 'string',
		},
	],
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
};
