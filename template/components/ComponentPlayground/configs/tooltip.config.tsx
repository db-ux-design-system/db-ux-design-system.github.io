import type { PlaygroundConfig } from '../types';
import { DBButton, DBTooltip, type DBTooltipProps } from '@db-ux/react-core-components';

export const tooltipConfig: PlaygroundConfig<DBTooltipProps & { text?: string }> = {
	render: ({ text, ...rest }) => (
		<DBButton type="button">
			Hover me <DBTooltip {...rest}>{text}</DBTooltip>
		</DBButton>
	),
	defaultProps: {
		id: 'demo-tooltip',
		placement: 'top',
		animation: true,
		showArrow: true,
		emphasis: 'strong',
		width: 'auto',
	},
	properties: [
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
		},
		{
			name: 'placement',
			label: 'Placement',
			type: 'select',
			defaultValue: 'bottom',
			options: [
				{ value: 'top', label: 'Top' },
				{ value: 'bottom', label: 'Bottom', default: true },
				{ value: 'left', label: 'Left' },
				{ value: 'right', label: 'Right' },
			],
		},
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			defaultValue: 'strong',
			options: [
				{ value: 'weak', label: 'Weak' },
				{ value: 'strong', label: 'Strong', default: true },
			],
		},
		{
			name: 'width',
			label: 'Width',
			type: 'select',
			defaultValue: 'auto',
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'fixed', label: 'Fixed' },
			],
		},
		{
			name: 'delay',
			label: 'Delay',
			type: 'select',
			defaultValue: 'none',
			options: [
				{ value: 'none', label: 'None', default: true },
				{ value: 'slow', label: 'Slow' },
				{ value: 'fast', label: 'Fast' },
			],
		},
		{
			name: 'animation',
			label: 'Animation',
			type: 'checkbox',
			defaultValue: true,
		},
		{
			name: 'showArrow',
			label: 'Show Arrow',
			type: 'checkbox',
			defaultValue: true,
		},
	],
};
