import type { PlaygroundConfig } from '../types';
import { DBNotification, type DBNotificationProps } from '@db-ux/react-core-components';

export const notificationConfig: PlaygroundConfig<DBNotificationProps & { linkText?: string }> = {
	render: (props) => {
		const link =
			props.variant === 'overlay' ||
			(props.linkVariant !== 'inline' && props.linkVariant !== 'block') ? undefined : (
				<a>{props.linkText}</a>
			);

		return <DBNotification {...props} text={props.text} link={link} />;
	},
	defaultProps: {
		semantic: 'adaptive',
		variant: 'standalone',
		headline: 'Headline',
	},
	properties: [
		// Content
		{
			name: 'headline',
			type: 'text',
			label: 'Headline',
			defaultValue: 'Headline',
		},
		{
			name: 'showHeadline',
			type: 'checkbox',
			label: 'Show Headline',
			defaultValue: true,
		},
		{
			name: 'text',
			type: 'text',
			label: 'Text',
			defaultValue: 'Text',
		},
		{
			name: 'linkText',
			type: 'text',
			label: 'Link Text',
			defaultValue: 'Link',
			dependsOn: { prop: 'variant', notValue: 'overlay' },
		},

		// Appearance
		{
			name: 'semantic',
			type: 'select',
			label: 'Semantic',
			defaultValue: 'adaptive',
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
			name: 'variant',
			type: 'select',
			label: 'Variant',
			defaultValue: 'standalone',
			options: [
				{ value: 'docked', label: 'Docked' },
				{ value: 'standalone', label: 'Standalone', default: true },
				{ value: 'overlay', label: 'Overlay' },
			],
		},
		{
			name: 'linkVariant',
			type: 'select',
			label: 'Link Variant',
			defaultValue: 'block',
			options: [
				{ value: 'block', label: 'Block', default: true },
				{ value: 'inline', label: 'Inline' },
				{ value: 'none', label: 'None' },
			],
		},
		{
			name: 'showIcon',
			type: 'checkbox',
			label: 'Show Icon',
			defaultValue: true,
		},
		{
			name: 'closeable',
			type: 'checkbox',
			label: 'Closeable',
			defaultValue: true,
		},
		{
			name: 'showTimestamp',
			type: 'checkbox',
			label: 'Show Timestamp',
			defaultValue: false,
			dependsOn: { prop: 'variant', value: 'overlay' },
		},
		{
			name: 'timestamp',
			type: 'text',
			label: 'Timestamp',
			defaultValue: '10 min. ago',
			dependsOn: 'showTimestamp',
		},
	],
};
