import type { PlaygroundConfig } from '../types';
import { DBLink, type DBLinkProps } from '@db-ux/react-core-components';

export const linkConfig: PlaygroundConfig<DBLinkProps> = {
	render: (props) => <DBLink {...props}>{props.text}</DBLink>,
	defaultProps: {
		href: '#',
		content: 'internal',
		'show-icon': 'true',
	},
	properties: [
		// Content
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
		},

		// Appearance
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'brand', label: 'Brand' },
				// { value: 'inline', label: 'Inline' },
			],
		},
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			options: [
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'small', label: 'Small' },
			],
		},
		{
			name: 'content',
			label: 'Content',
			type: 'select',
			options: [
				{ value: 'internal', label: 'Internal', default: true },
				{ value: 'external', label: 'External' },
			],
			dependsOn: { prop: 'showIcon', value: 'true' },
		},

		// States
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'showIcon',
			type: 'checkbox',
			label: 'Show Icon',
			defaultValue: true,
			dependsOn: { prop: 'variant', notValue: 'inline' },
		},
	],
};
