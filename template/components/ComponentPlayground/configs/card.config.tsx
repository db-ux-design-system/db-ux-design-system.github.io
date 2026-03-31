import type { PlaygroundConfig } from '../types';
import { DBCard, type DBCardProps } from '@db-ux/react-core-components';

export const cardConfig: PlaygroundConfig<DBCardProps> = {
	render: (props) => {
		if (props.behavior === 'interactive') {
			return (
				<button>
					<DBCard {...props}>Default text</DBCard>
				</button>
			);
		}

		return <DBCard {...props}>Default text</DBCard>;
	},
	defaultProps: {
		id: 'demo-card',
		behavior: 'static',
		'elevation-level': '1',
		spacing: 'medium',
	},
	properties: [
		{
			name: 'behavior',
			label: 'Behavior',
			type: 'select',
			defaultValue: 'static',
			options: [
				{ value: 'static', label: 'Static', default: true },
				{ value: 'interactive', label: 'Interactive' },
			],
		},
		{
			name: 'elevationLevel',
			label: 'Elevation Level',
			type: 'select',
			defaultValue: '1',
			options: [
				{ value: '1', label: '1', default: true },
				{ value: '2', label: '2' },
				{ value: '3', label: '3' },
			],
		},
		{
			name: 'spacing',
			label: 'Spacing',
			type: 'select',
			defaultValue: 'medium',
			options: [
				{ value: 'none', label: 'None' },
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'large', label: 'Large' },
			],
		},
	],
};
