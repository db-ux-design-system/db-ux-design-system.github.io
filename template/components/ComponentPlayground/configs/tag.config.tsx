import type { PlaygroundConfig } from '../types';
import { DBTag, type DBTagProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const tagConfig: PlaygroundConfig<
	DBTagProps & { childrenType: 'button' | 'checkbox' | 'radio'; disabled: boolean }
> = {
	render: ({ childrenType, behavior, disabled, text, ...rest }) => {
		if (behavior === 'static' || behavior === 'removable') {
			return <DBTag behavior={behavior} {...rest} text={text} />;
		}

		if (childrenType === 'button') {
			return (
				<DBTag {...rest}>
					<button disabled={disabled}>{text}</button>
				</DBTag>
			);
		}

		if (childrenType === 'checkbox' || childrenType === 'radio') {
			return (
				<DBTag {...rest}>
					<label htmlFor="tag-checkbox">
						<input disabled={disabled} id="tag-checkbox" type={childrenType} />
						{text}
					</label>
				</DBTag>
			);
		}

		return <></>;
	},
	defaultProps: {
		behavior: 'static',
		semantic: 'adaptive',
		emphasis: 'weak',
		id: 'playground-tag',
	},
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
	properties: [
		// Content
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
			description: 'Alternative for children to set content as property.',
		},
		// Appearance
		{
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			description: 'Defines the behavior of the component',
			options: [
				{ value: 'static', label: 'Static', default: true },
				{ value: 'interactive', label: 'Interactive' },
				{ value: 'removable', label: 'Removable' },
			],
		},
		{
			name: 'childrenType',
			label: 'Children Type',
			type: 'select',
			description: 'Defines the interactive behavior of the component',
			options: [
				{ value: 'button', label: 'Button', default: true },
				{ value: 'checkbox', label: 'Checkbox' },
				{ value: 'radio', label: 'Radio' },
			],
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
			description: 'The disabled attribute can be set to keep a user from clicking on the tag.',
			showInPlayground: true,
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'semantic',
			label: 'Semantic',
			type: 'select',
			description: 'The semantic defines the default variants for most components.',
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
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			description: 'The emphasis attribute divides in between a weak or strong importance.',
			options: [
				{ value: 'weak', label: 'Weak', default: true },
				{ value: 'strong', label: 'Strong' },
			],
		},

		// Hidden properties
		{
			name: 'show-icon',
			alternativeName: 'showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enables or disables the visibility of the icon.',
			showInPlayground: true,
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,
			defaultValue: 'x_placeholder',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content.',
			dependsOn: 'show-icon',
		},
		{
			name: 'show-check-state',
			alternativeName: 'showCheckState',
			label: 'Show Check State',
			type: 'checkbox',
			defaultValue: false,
			description: 'Enable/Disable icon for checkbox/radio inside tag.',
			showInPlayground: true,
			dependsOn: { prop: 'behavior', value: 'interactive' },
		},
		{
			name: 'no-text',
			alternativeName: 'noText',
			label: 'No Text',
			type: 'checkbox',
			defaultValue: false,
			description: 'Define the text next to the icon to get hidden.',
			showInPlayground: true,
		},

		{
			name: 'remove-button',
			alternativeName: 'removeButton',
			label: 'Remove Button',
			type: 'text',
			defaultValue: '',
			description: 'The removeButton attribute shows the cancel button.',
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
