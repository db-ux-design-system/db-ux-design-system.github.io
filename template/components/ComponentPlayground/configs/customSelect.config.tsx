import type { PlaygroundConfig } from '../types';
import { DBCustomSelect, type DBCustomSelectProps } from '@db-ux/react-core-components';

export const customSelectConfig: PlaygroundConfig<DBCustomSelectProps> = {
	render: (props) => (
		<DBCustomSelect
			{...props}
			label={props.label}
			options={[{ value: 'Test 1' }, { value: 'Test2' }]}
		/>
	),
	defaultProps: {
		id: 'demo-custom-select',
		label: 'Label',
		placeholder: 'Placeholder',
	},
	properties: [
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
			name: 'multiple',
			label: 'Multiple',
			type: 'checkbox',
			defaultValue: false,
		},
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
			name: 'validation',
			label: 'Validation',
			type: 'select',
			defaultValue: 'no-validation',
			options: [
				{ value: 'invalid', label: 'Invalid' },
				{ value: 'valid', label: 'Valid' },
				{ value: 'no-validation', label: 'No Validation', default: true },
			],
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'selectedType',
			label: 'Selected Type',
			type: 'select',
			defaultValue: 'text',
			options: [
				{ value: 'amount', label: 'Amount' },
				{ value: 'text', label: 'Text', default: true },
				{ value: 'tag', label: 'Tag' },
			],
		},
		{
			name: 'placement',
			label: 'Placement',
			type: 'select',
			defaultValue: 'bottom',
			options: [
				{ value: 'top', label: 'Top' },
				{ value: 'bottom', label: 'Bottom', default: true },
				{ value: 'top-start', label: 'Top Start' },
				{ value: 'top-end', label: 'Top End' },
				{ value: 'bottom-start', label: 'Bottom Start' },
				{ value: 'bottom-end', label: 'Bottom End' },
			],
		},
		{
			name: 'formFieldWidth',
			label: 'Form Field Width',
			type: 'select',
			defaultValue: 'full',
			options: [
				{ value: 'full', label: 'Full', default: true },
				{ value: 'auto', label: 'Auto' },
			],
		},
		{
			name: 'dropdownWidth',
			label: 'Dropdown Width',
			type: 'select',
			defaultValue: 'fixed',
			options: [
				{ value: 'fixed', label: 'Fixed', default: true },
				{ value: 'auto', label: 'Auto' },
				{ value: 'full', label: 'Full' },
			],
		},
	],
};
