import type { PlaygroundConfig } from '../types';
import { DBInput, type DBInputProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const inputConfig: PlaygroundConfig<DBInputProps> = {
	render: (props, onPropChange) => {
		return (
			<DBInput
				{...props}
				label={props.label}
				type={props.type}
				onInput={(e) => onPropChange('value', e.currentTarget.value)}
			/>
		);
	},
	defaultProps: {
		label: 'Label',
		placeholder: 'Placeholder',
		type: 'text',
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
			name: 'placeholder',
			label: 'Placeholder',
			type: 'text',
			defaultValue: 'Placeholder',
		},

		// Appearance
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
			name: 'type',
			label: 'Type',
			type: 'select',
			options: [
				{ value: 'text', label: 'Text', default: true },
				{ value: 'color', label: 'Color' },
				{ value: 'date', label: 'Date' },
				{ value: 'datetime-local', label: 'Datetime Local' },
				{ value: 'email', label: 'Email' },
				{ value: 'file', label: 'File' },
				{ value: 'hidden', label: 'Hidden' },
				{ value: 'month', label: 'Month' },
				{ value: 'number', label: 'Number' },
				{ value: 'password', label: 'Password' },
				{ value: 'range', label: 'Range' },
				{ value: 'search', label: 'Search' },
				{ value: 'tel', label: 'Tel' },
				{ value: 'time', label: 'Time' },
				{ value: 'url', label: 'URL' },
				{ value: 'week', label: 'Week' },
			],
		},

		// States
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'readonly',
			label: 'Readonly',
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
		{
			name: 'required',
			label: 'Required',
			type: 'checkbox',
			defaultValue: false,
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
			defaultValue: 'Helper message',
			dependsOn: 'showMessage',
		},

		{
			name: 'showIconLeading',
			label: 'Show Icon Leading',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'iconLeading',
			label: 'Icon Leading',
			...IconOption,

			dependsOn: 'showIconLeading',
		},
		{
			name: 'showIconTrailing',
			label: 'Show Icon Trailing',
			type: 'checkbox',
			defaultValue: false,
		},

		{
			name: 'iconTrailing',
			label: 'Icon Trailing',
			...IconOption,

			dependsOn: 'showIconTrailing',
		},
	],
};
