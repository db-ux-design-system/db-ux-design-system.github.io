import type { PlaygroundConfig } from '../types';
import { DBCheckbox, type DBCheckboxProps } from '@db-ux/react-core-components';

export const checkboxConfig: PlaygroundConfig<DBCheckboxProps> = {
	render: (props, onPropChange) => (
		<DBCheckbox
			{...props}
			label={props.label}
			onChange={(event) => onPropChange?.('checked', event.target.checked)}
		/>
	),
	defaultProps: {
		checked: false,
	},
	properties: [
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
			name: 'checked',
			label: 'Checked',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'indeterminate',
			label: 'Indeterminate',
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
			defaultValue: 'Invalid message',
			dependsOn: { prop: 'validation', value: 'invalid' },
		},
		{
			name: 'valid-message',
			label: 'Valid Message',
			type: 'text',
			defaultValue: 'Valid message',
			dependsOn: { prop: 'validation', value: 'valid' },
		},
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
