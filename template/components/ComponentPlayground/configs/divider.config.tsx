import type { PlaygroundConfig } from '../types';
import { DBDivider, type DBDividerProps } from '@db-ux/react-core-components';

export const dividerConfig: PlaygroundConfig<DBDividerProps> = {
	render: (props) => (
		<div
			className="divider-container"
			style={
				props.variant === 'vertical'
					? { display: 'flex', justifyContent: 'center', height: '100px' }
					: undefined
			}
		>
			<DBDivider {...props} width="full" />
		</div>
	),
	defaultProps: {
		id: 'demo-divider',
		emphasis: 'weak',
		variant: 'horizontal',
	},
	properties: [
		{
			name: 'variant',
			label: 'Variant',
			type: 'select',
			defaultValue: 'horizontal',
			options: [
				{ value: 'horizontal', label: 'Horizontal', default: true },
				{ value: 'vertical', label: 'Vertical' },
			],
		},
		{
			name: 'emphasis',
			label: 'Emphasis',
			type: 'select',
			defaultValue: 'weak',
			options: [
				{ value: 'weak', label: 'Weak', default: true },
				{ value: 'strong', label: 'Strong' },
			],
		},
		// {
		// 	name: 'margin',
		// 	label: 'Margin',
		// 	type: 'select',
		// 	defaultValue: '_',
		// 	options: [
		// 		{ value: '_', label: 'Default', default: true },
		// 		{ value: 'none', label: 'None' },
		// 	],
		// },
	],
};
