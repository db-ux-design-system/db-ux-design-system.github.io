export const linkConfig = {
	elementId: 'playground-link',
	textElementId: 'playground-link-text',
	defaultText: 'Link Text',
	useAriaDisabled: true,
	defaultProps: {
		href: '#',
		content: '',
	},
	properties: [
		// Content
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Link Text',
			description: 'Alternative for default slot/children.',
		},

		// Appearance
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			description:
				'Change the styling of the link. inline will remove the arrow. Defaults to adaptive.',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'brand', label: 'Brand' },
				{ value: 'inline', label: 'Inline' },
			],
		},
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			description: 'Change the size of the link',
			options: [
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'small', label: 'Small' },
			],
		},
		{
			name: 'content',
			label: 'Content',
			type: 'select',
			description: 'Adds a different arrow after the link to indicate external or internal link',
			options: [
				{ value: '', label: 'None', default: true },
				{ value: 'external', label: 'External' },
				{ value: 'internal', label: 'Internal' },
			],
		},

		// States
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			description: 'Disables the link.',
		},

		// Hidden properties
		{
			name: 'href',
			label: 'Href',
			type: 'text',
			defaultValue: '#',
			description: 'The URL that the hyperlink points to.',
			showInPlayground: false,
		},
		{
			name: 'target',
			label: 'Target',
			type: 'select',
			description: 'Where to open the linked URL, as the name for a browsing context.',
			options: [
				{ value: '_self', label: '_self', default: true },
				{ value: '_blank', label: '_blank' },
				{ value: '_parent', label: '_parent' },
				{ value: '_top', label: '_top' },
			],
			showInPlayground: false,
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
			name: 'wrap',
			label: 'Wrap',
			type: 'checkbox',
			defaultValue: false,
			description: 'Determines whether the text should wrap when its parent container is too small, preventing overflow.',
			showInPlayground: false,
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
			name: 'rel',
			type: 'text',
			label: 'Rel',
			description: 'The relationship of the linked URL as space-separated link types.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'role',
			type: 'text',
			label: 'Role',
			description: 'Sets aria role based on aria-role.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'referrerpolicy',
			type: 'text',
			label: 'Referrer Policy',
			description: 'How much of the referrer to send when following the link.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'referrer-policy',
			alternativeName: 'referrerPolicy',
			type: 'text',
			label: 'Referrer Policy',
			description: 'How much of the referrer to send when following the link.',
			defaultValue: '',
			showInPlayground: false
		},
		{
			name: 'hreflang',
			type: 'text',
			label: 'Hreflang',
			description: 'Hints for the human language of the linked page or document.',
			defaultValue: '',
			showInPlayground: false
		},
	],
};
