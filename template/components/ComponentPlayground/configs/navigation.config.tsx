import type { PlaygroundConfig } from '../types';
import {
	DBNavigation,
	DBNavigationItem,
	type DBNavigationProps,
} from '@db-ux/react-core-components';

export const navigationConfig: PlaygroundConfig<DBNavigationProps> = {
	render: (props) => (
		<DBNavigation {...props}>
			<DBNavigationItem>
				<a>Link 1</a>
			</DBNavigationItem>
			<DBNavigationItem>
				<a>Link 2</a>
			</DBNavigationItem>
			<DBNavigationItem>
				<a>Link 3</a>
			</DBNavigationItem>
		</DBNavigation>
	),
	defaultProps: {},
	slots: [{ name: 'children', description: 'Default slot' }],
	properties: [
		{
			name: 'id',
			type: 'text',
			label: 'ID',
			description:
				'ID of the component, generated automatically for some components as a fallback if unset.',
			defaultValue: '',
			showInPlayground: false,
		},
		{
			name: 'className',
			type: 'text',
			label: 'Class Name',
			description: 'React specific for adding className to the component.',
			defaultValue: '',
			showInPlayground: false,
		},
	],
};
