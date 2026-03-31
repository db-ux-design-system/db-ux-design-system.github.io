import type { PlaygroundConfig } from '../types';
import { DBSwitch, type DBSwitchProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const switchConfig: PlaygroundConfig<DBSwitchProps> = {
	render: (props, onPropChange) => (
		<DBSwitch
			{...props}
			label={props.label}
			onChange={(event) => onPropChange?.('checked', event.target.checked)}
		/>
	),
	defaultProps: {
		checked: false,
	},
	properties: [
		// Content
		{
			name: 'label',
			label: 'Label',
			type: 'text',
			defaultValue: 'Label',
		},
		{
			name: 'showLabel',
			label: 'Show Label',
			type: 'checkbox',
			defaultValue: true,
		},

		// Appearance
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			options: [
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
			],
		},
		{
			name: 'visualAid',
			label: 'Visual Aid',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'iconLeading',
			...IconOption,
			label: 'Icon Leading',
			defaultValue: 'check',
			dependsOn: 'visualAid',
		},
		{
			name: 'iconTrailing',
			...IconOption,
			label: 'Icon Trailing',
			defaultValue: 'cross',
			dependsOn: 'visualAid',
		},

		// States
		{
			name: 'checked',
			label: 'Checked',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'required',
			label: 'Required',
			type: 'checkbox',
			defaultValue: false,
		},

		// Validation
		{
			name: 'validation',
			label: 'Validation',
			type: 'select',
			options: [
				{ value: 'no-validation', label: 'No Validation', default: true },
				{ value: 'invalid', label: 'Invalid' },
				{ value: 'valid', label: 'Valid' },
			],
		},
		{
			name: 'invalid-message',
			label: 'Invalid Message',
			type: 'text',
			defaultValue: 'Please enter an invalid message',
			dependsOn: { prop: 'validation', value: 'invalid' },
		},
		{
			name: 'valid-message',
			label: 'Valid Message',
			type: 'text',
			defaultValue: 'Please enter a valid message',
			dependsOn: { prop: 'validation', value: 'valid' },
		},

		// Message
		{
			name: 'showMessage',
			label: 'Show Message',
			type: 'checkbox',
			defaultValue: false,
			dependsOn: { prop: 'validation', value: 'no-validation' },
		},
		{
			name: 'message',
			label: 'Message',
			type: 'text',
			defaultValue: 'Message',
			dependsOn: 'showMessage',
		},
	],
};
