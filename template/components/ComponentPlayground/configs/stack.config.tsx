import type { PlaygroundConfig } from '../types';
import { DBStack, type DBStackProps, DBTag } from '@db-ux/react-core-components';

export const stackConfig: PlaygroundConfig<DBStackProps> = {
	render: (props) => {
		return (
			<DBStack {...props}>
				<DBTag>Test 1</DBTag>
				<DBTag>Test 2</DBTag>
				<DBTag>Test 3</DBTag>
			</DBStack>
		);
	},
	defaultProps: {
		gap: 'medium',
		variant: 'simple',
		direction: 'column',
		alignment: 'stretch',
	},
	properties: [
		{
			name: 'direction',
			type: 'select',
			label: 'Direction',
			defaultValue: 'column',
			options: [
				{ value: 'column', label: 'Column', default: true },
				{ value: 'row', label: 'Row' },
			],
		},
		{
			name: 'gap',
			type: 'select',
			label: 'Gap',
			defaultValue: 'medium',
			options: [
				{ value: 'none', label: 'None' },
				{ value: '3x-small', label: '3x-small' },
				{ value: '2x-small', label: '2x-small' },
				{ value: 'x-small', label: 'x-small' },
				{ value: 'small', label: 'Small' },
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'large', label: 'Large' },
				{ value: 'x-large', label: 'x-large' },
				{ value: '2x-large', label: '2x-large' },
				{ value: '3x-large', label: '3x-large' },
			],
		},
		{
			name: 'alignment',
			type: 'select',
			label: 'Alignment',
			defaultValue: 'stretch',
			options: [
				{ value: 'stretch', label: 'Stretch', default: true },
				{ value: 'start', label: 'Start' },
				{ value: 'end', label: 'End' },
				{ value: 'center', label: 'Center' },
			],
		},
		{
			name: 'justifyContent',
			type: 'select',
			label: 'Justify Content',
			defaultValue: 'start',
			options: [
				{ value: 'start', label: 'Start', default: true },
				{ value: 'end', label: 'End' },
				{ value: 'center', label: 'Center' },
				{ value: 'space-between', label: 'Space Between' },
			],
		},
	],
};
