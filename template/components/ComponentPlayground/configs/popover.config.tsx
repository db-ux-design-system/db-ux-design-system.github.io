import type { PlaygroundConfig } from '../types';
import { DBButton, DBPopover, type DBPopoverProps } from '@db-ux/react-core-components';

export const popoverConfig: PlaygroundConfig<DBPopoverProps> = {
	render: (props) => (
		<DBPopover {...props} trigger={<DBButton type="button">Hover me</DBButton>}>
			Popover
		</DBPopover>
	),
	defaultProps: {
		spacing: 'medium',
		placement: 'top',
		width: 'auto',
		gap: false,
	},
	properties: [
		{
			name: 'placement',
			label: 'Placement',
			type: 'select',
			defaultValue: 'top',
			options: [
				{ label: 'Top', value: 'top', default: true },
				{ label: 'Bottom', value: 'bottom', default: false },
				{ label: 'Left', value: 'left', default: false },
				{ label: 'Right', value: 'right', default: false },
			],
		},
		{
			name: 'spacing',
			label: 'Spacing',
			type: 'select',
			defaultValue: 'medium',
			options: [
				{ label: 'None', value: 'none', default: false },
				{ label: 'Small', value: 'small', default: false },
				{ label: 'Medium', value: 'medium', default: true },
				{ label: 'Large', value: 'large', default: false },
			],
		},
		{
			name: 'width',
			label: 'Width',
			type: 'select',
			defaultValue: 'auto',
			options: [
				{ label: 'Auto', value: 'auto', default: true },
				{ label: 'Fixed', value: 'fixed', default: false },
			],
		},
		{
			name: 'gap',
			label: 'Gap',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'delay',
			label: 'Delay',
			type: 'select',
			defaultValue: 'none',
			options: [
				{ label: 'None', value: 'none', default: true },
				{ label: 'Fast', value: 'fast', default: false },
				{ label: 'Slow', value: 'slow', default: false },
			],
		},
	],
};
