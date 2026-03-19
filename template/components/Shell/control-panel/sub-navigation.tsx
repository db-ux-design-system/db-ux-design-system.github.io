import { DBNavigation, DBShellSubNavigation } from '@db-ux/react-core-components';
import NavItem from './nav-item.tsx';
import type { NavigationItemGroupVariantType } from '@db-ux/react-core-components/dist/shared/model';

const SubNavigation = ({
	navigationItems,
	variant,
}: {
	navigationItems: NavigationItem[];
	variant?: NavigationItemGroupVariantType;
}) => (
	<DBShellSubNavigation>
		<DBNavigation aria-label="sub navigation" variant={variant ?? 'tree'}>
			{navigationItems.map((navigationItem: NavigationItem) => (
				<NavItem
					{...navigationItem}
					icon={navigationItem.icon ?? 'circle_small'}
					key={`sub-navigation-${navigationItem.path}-${navigationItem.path}`}
				/>
			))}
		</DBNavigation>
	</DBShellSubNavigation>
);

export default SubNavigation;
