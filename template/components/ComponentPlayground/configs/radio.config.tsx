import type { PlaygroundConfig } from '../types';
import { DBRadio, type DBRadioProps } from '@db-ux/react-core-components';

export const radioConfig: PlaygroundConfig<DBRadioProps> = {
	render: (props, onPropChange) => (
		<div role="radiogroup">
			<DBRadio
				{...props}
				label={props.label}
				onChange={(event) => onPropChange?.('checked', event.target.checked)}
			/>
		</div>
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

		// Hidden properties
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
			name: 'required',
			label: 'Required',
			type: 'checkbox',
			defaultValue: false,
		},
	],
};
