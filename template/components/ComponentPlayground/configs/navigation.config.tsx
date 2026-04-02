import type { PlaygroundConfig } from '../types';
import {
	DBNavigation,
	DBNavigationItem,
	DBNavigationItemGroup,
	type DBNavigationProps,
	DBShell,
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
	properties: [],
};
