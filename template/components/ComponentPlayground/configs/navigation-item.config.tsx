import type { PlaygroundConfig } from '../types';
import {
	DBNavigation,
	DBNavigationItem,
	type DBNavigationItemProps,
} from '@db-ux/react-core-components';
import { IconOption } from '@components/ComponentPlayground/configs/_icon.option.tsx';

export const navigationItemConfig: PlaygroundConfig<DBNavigationItemProps> = {
	defaultProps: {},
	render: ({ text, ...rest }) => (
		<DBNavigation>
			<DBNavigationItem {...rest}>
				<a>{text}</a>
			</DBNavigationItem>
		</DBNavigation>
	),
	properties: [
		{
			name: 'text',
			type: 'text',
			defaultValue: 'Navigation Item',
			label: 'Text',
		},
		{
			name: 'width',
			type: 'select',
			options: [
				{ value: 'auto', label: 'Auto', default: true },
				{ value: 'full', label: 'Full' },
			],
			defaultValue: 'auto',
			label: 'Width',
		},
		{
			name: 'icon',
			...IconOption,
			label: 'Icon',
			dependsOn: 'showIcon',
		},
		{
			name: 'showIcon',
			type: 'checkbox',
			defaultValue: true,
			label: 'Show Icon',
		},
		{
			name: 'active',
			type: 'checkbox',
			defaultValue: false,
			label: 'Active',
		},
		{
			name: 'disabled',
			type: 'checkbox',
			defaultValue: false,
			label: 'Disabled',
		},
	],
};
