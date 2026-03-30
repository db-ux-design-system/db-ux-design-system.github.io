import type { PlaygroundConfig } from '../types';
import { DBNotification, type DBNotificationProps } from '@db-ux/react-core-components';

export const notificationConfig: PlaygroundConfig<DBNotificationProps & { linkText?: string }> = {
	render: (props) => {
		const link =
			props.linkVariant !== 'inline' && props.linkVariant !== 'block' ? undefined : (
				<a>{props.linkText}</a>
			);

		return <DBNotification {...props} text={props.text} link={link} />;
	},
	defaultProps: {
		semantic: 'adaptive',
		variant: 'standalone',
		headline: 'Headline',
	},
	slots: [
		{ name: 'children', description: 'Default slot for notification text content' },
		{ name: 'image', description: 'The slotImage can be set instead of an icon' },
		{ name: 'link', description: 'The slotLink can be set for non overlay-notifications' },
	],
	events: [{ name: 'close / onClose', type: '---' }],
	properties: [
		// Content
		{
			name: 'headline',
			type: 'text',
			label: 'Headline',
			description: 'The headline attribute changes the text of the bold headline.',
			defaultValue: 'Headline',
			showInPlayground: true,
		},
		{
			name: 'show-headline',
			alternativeName: 'showHeadline',
			type: 'checkbox',
			label: 'Show Headline',
			description: 'Enables or disables the visibility of the headline.',
			defaultValue: true,
			showInPlayground: true,
		},
		{
			name: 'text',
			type: 'text',
			label: 'Text',
			description: 'Alternative for default slot/children.',
			defaultValue: 'Text',
			showInPlayground: true,
		},
		{
			name: 'link-text',
			alternativeName: 'linkText',
			type: 'text',
			label: 'Link Text',
			description: 'Text content of the notification link.',
			defaultValue: 'Link',
			showInPlayground: true,
		},

		// Appearance
		{
			name: 'semantic',
			type: 'select',
			label: 'Semantic',
			description: 'The semantic defines the default variants for most components.',
			defaultValue: 'adaptive',
			showInPlayground: true,
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
			description:
				'The variant attribute changes the styling of the notification. Docked notifications are used between header and main content. Standalone notifications are used inside forms. Overlay notifications are used for floating snackbars.',
			defaultValue: 'standalone',
			showInPlayground: true,
			options: [
				{ value: 'docked', label: 'Docked' },
				{ value: 'standalone', label: 'Standalone', default: true },
				{ value: 'overlay', label: 'Overlay' },
			],
		},
		{
			name: 'link-variant',
			alternativeName: 'linkVariant',
			type: 'select',
			label: 'Link Variant',
			description: 'The linkVariant will be used if slotLink is set.',
			defaultValue: 'block',
			showInPlayground: true,
			options: [
				{ value: 'block', label: 'Block', default: true },
				{ value: 'inline', label: 'Inline' },
				{ value: 'none', label: 'None' },
			],
		},
		{
			name: 'show-icon',
			alternativeName: 'showIcon',
			type: 'checkbox',
			label: 'Show Icon',
			description:
				'Enables or disables the visibility of the icon. The default value depends on the component.',
			defaultValue: true,
			showInPlayground: true,
		},
		{
			name: 'closeable',
			type: 'checkbox',
			label: 'Closeable',
			description: 'The closeable attribute shows/hides the close button on the top right.',
			defaultValue: true,
			showInPlayground: true,
		},
		{
			name: 'show-timestamp',
			alternativeName: 'showTimestamp',
			type: 'checkbox',
			label: 'Show Timestamp',
			description: 'Enables or disables the visibility of the timestamp.',
			defaultValue: false,
			showInPlayground: true,
			dependsOn: { prop: 'variant', value: 'overlay' },
		},
		{
			name: 'timestamp',
			type: 'text',
			label: 'Timestamp',
			description: 'The timestamp attribute can be set for overlay notifications.',
			defaultValue: '10 min. ago',
			showInPlayground: true,
			dependsOn: 'show-timestamp',
		},

		// Hidden properties
		{
			name: 'icon',
			type: 'text',
			label: 'Icon',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'close-button-id',
			alternativeName: 'closeButtonId',
			type: 'text',
			label: 'Close Button ID',
			description: 'The closeButtonId attribute changes the id inside the close button.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'close-button-text',
			alternativeName: 'closeButtonText',
			type: 'text',
			label: 'Close Button Text',
			description: 'The closeButtonText attribute changes the text inside the close button.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'aria-live',
			alternativeName: 'ariaLive',
			type: 'select',
			label: 'Aria Live',
			description:
				'The arialive attribute will lead to that the screenreader interrupts immediately and reads out the notification if set to "assertive", while it will wait for the user\'s idleness when set to "polite".',
			defaultValue: 'polite',
			showInPlayground: false,
			options: [
				{ value: 'assertive', label: 'Assertive' },
				{ value: 'polite', label: 'Polite', default: true },
				{ value: 'off', label: 'Off' },
			],
		},
		{
			name: 'role',
			type: 'text',
			label: 'Role',
			description: 'Sets aria role based on aria-role.',
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
	],
};
