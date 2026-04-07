import type { PlaygroundConfig } from '../types';
import {
	DBNavigation,
	DBNavigationItem,
	DBShell,
	type DBShellProps,
} from '@db-ux/react-core-components';

export const headerConfig: PlaygroundConfig<DBShellProps> = {
	render: (props) => {
		return (
			<DBShell {...props}>
				<DBNavigation>
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
			</DBShell>
		);
	},
	defaultProps: {
		id: 'playground-header',
	},
	properties: [
		{
			name: 'width',
			label: 'Width',
			type: 'select',
			options: [
				{ value: 'full', label: 'Full' },
				{ value: 'medium', label: 'Medium' },
				{ value: 'large', label: 'Large' },
				{ value: 'small', label: 'Small' },
			],
		},
	],
};
