import type { PlaygroundConfig } from '../types';
import { DBInfotext, type DBInfotextProps } from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const infotextConfig: PlaygroundConfig<DBInfotextProps> = {
	render: (props) => <DBInfotext {...props} text={props.text} />,
	defaultProps: {
		id: 'demo-infotext',
		semantic: 'adaptive',
		size: 'medium',
		showIcon: true,
	},
	properties: [
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
		},
		{
			name: 'semantic',
			label: 'Semantic',
			type: 'select',
			defaultValue: 'informational',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'neutral', label: 'Neutral' },
				{ value: 'critical', label: 'Critical' },
				{ value: 'informational', label: 'Informational' },
				{ value: 'warning', label: 'Warning' },
				{ value: 'successful', label: 'Successful' },
			],
		},
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			defaultValue: 'small',
			options: [
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'small', label: 'Small' },
			],
		},
		{
			name: 'showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: true,
			dependsOn: { prop: 'semantic', value: 'adaptive' },
		},
	],
};
