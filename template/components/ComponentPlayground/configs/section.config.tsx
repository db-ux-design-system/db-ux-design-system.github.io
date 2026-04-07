import type { PlaygroundConfig } from '../types';
import { DBSection, type DBSectionProps } from '@db-ux/react-core-components';

export const sectionConfig: PlaygroundConfig<DBSectionProps> = {
	render: (props) => (
		<DBSection {...props} data-color="informational">
			Content
		</DBSection>
	),
	defaultProps: {
		spacing: 'medium',
		width: 'full',
	},
	properties: [
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
			defaultValue: 'full',
			options: [
				{ label: 'Full', value: 'full', default: true },
				{ label: 'Small', value: 'small', default: false },
				{ label: 'Medium', value: 'medium', default: false },
				{ label: 'Large', value: 'large', default: false },
			],
		},
	],
};
