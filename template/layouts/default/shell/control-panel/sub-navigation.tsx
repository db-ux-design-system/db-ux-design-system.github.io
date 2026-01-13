import { DBNavigation, DBShellSubNavigation } from '@db-ux/react-core-components';
import NavItem from '@template/layouts/default/shell/control-panel/nav-item.tsx';
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
					key={`sub-navigation-${navigationItem.path}-${navigationItem.path}`}
					{...navigationItem}
				/>
			))}
		</DBNavigation>
	</DBShellSubNavigation>
);

export default SubNavigation;
