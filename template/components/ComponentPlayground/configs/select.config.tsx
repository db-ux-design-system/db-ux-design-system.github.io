import type { PlaygroundConfig } from '../types';
import { DBSelect, type DBSelectProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const selectConfig: PlaygroundConfig<DBSelectProps> = {
	render: (props) => {
		return (
			// eslint-disable-next-line db-ux/form-label-required
			<DBSelect {...props}>
				<option value="1">Option 1</option>
				<option value="2">Option 2</option>
				<option value="3">Option 3</option>
			</DBSelect>
		);
	},
	defaultProps: {
		label: 'Label',
		placeholder: 'Placeholder',
	},
	properties: [
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			options: [
				{ value: 'above', label: 'Above', default: true },
				{ value: 'floating', label: 'Floating' },
			],
		},
		{
			name: 'showLabel',
			label: 'Show Label',
			type: 'checkbox',
			defaultValue: true,
			dependsOn: { prop: 'variant', value: 'above' },
		},
		{
			name: 'label',
			label: 'Label',
			type: 'text',
			defaultValue: 'Label',
		},

		// Placeholder
		{
			name: 'placeholder',
			label: 'Placeholder',
			type: 'text',
			defaultValue: 'Placeholder',
		},
		// States
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
		// Icon
		{
			name: 'showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,

			dependsOn: 'showIcon',
		},
	],
};
