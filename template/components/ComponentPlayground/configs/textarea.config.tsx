import type { PlaygroundConfig } from '../types';
import { DBTextarea, type DBTextareaProps } from '@db-ux/react-core-components';

export const textareaConfig: PlaygroundConfig<DBTextareaProps> = {
	render: (props) => <DBTextarea {...props} label={props.label} />,
	defaultProps: {
		id: 'playground-textarea',
		label: 'Label',
		placeholder: 'Placeholder',
		variant: 'above',
	},
	properties: [
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
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			defaultValue: 'above',
			options: [
				{ value: 'above', label: 'Above', default: true },
				{ value: 'floating', label: 'Floating' },
			],
		},
		{
			name: 'resize',
			label: 'Resize',
			type: 'select',
			defaultValue: 'none',
			options: [
				{ value: 'none', label: 'None', default: true },
				{ value: 'both', label: 'Both' },
				{ value: 'horizontal', label: 'Horizontal' },
				{ value: 'vertical', label: 'Vertical' },
			],
		},
		{
			name: 'validation',
			label: 'Validation',
			type: 'select',
			defaultValue: 'no-validation',
			options: [
				{ value: 'no-validation', label: 'No Validation', default: true },
				{ value: 'valid', label: 'Valid' },
				{ value: 'invalid', label: 'Invalid' },
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
		}
	],
};
