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
	slots: [
		{
			name: 'children',
			description: 'default slot',
		},
	],
	properties: [
		{
			name: 'text',
			label: 'Text',
			type: 'text',
			defaultValue: 'Text',
			description: 'Alternative for default slot/children',
			showInPlayground: true,
		},
		{
			name: 'semantic',
			label: 'Semantic',
			type: 'select',
			defaultValue: 'informational',
			description: 'The semantic defines the default variants for most components',
			options: [
				{ value: 'adaptive', label: 'Adaptive', default: true },
				{ value: 'neutral', label: 'Neutral' },
				{ value: 'critical', label: 'Critical' },
				{ value: 'informational', label: 'Informational' },
				{ value: 'warning', label: 'Warning' },
				{ value: 'successful', label: 'Successful' },
			],
			showInPlayground: true,
		},
		{
			name: 'size',
			label: 'Size',
			type: 'select',
			defaultValue: 'small',
			description:
				'The size attribute changes the font-size and other related sizes of the component',
			options: [
				{ value: 'medium', label: 'Medium', default: true },
				{ value: 'small', label: 'Small' },
			],
			showInPlayground: true,
		},
		{
			name: 'show-icon',
			alternativeName: 'showIcon',
			label: 'Show Icon',
			type: 'checkbox',
			defaultValue: true,
			description: 'Enables or disables the visibility of the icon',
			showInPlayground: true,
			dependsOn: { prop: 'semantic', value: 'adaptive' },
		},
		{
			name: 'icon',
			label: 'Icon',
			...IconOption,
			defaultValue: '',
			description:
				'Define an icon by its identifier to get displayed in front of the elements content',
			showInPlayground: false,
		},
		{
			name: 'id',
			label: 'ID',
			type: 'text',
			defaultValue: '',
			description: 'ID of the component',
			showInPlayground: false,
		},
		{
			name: 'className',
			label: 'Class Name',
			type: 'text',
			defaultValue: '',
			description: 'React specific for adding className to the component',
			showInPlayground: false,
		},
	],
};
