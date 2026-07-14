import { DBControlPanelNavigation } from '@db-ux/react-core-components';
import { buildAppNavigationFromContent } from '@template/utils/content-navigation.ts';
import NavItem from './nav-item.tsx';

const MainNavigation = ({ mobile }: { mobile?: boolean }) => {
	const navigation = buildAppNavigationFromContent(mobile);

	return (
		<DBControlPanelNavigation variant={mobile ? 'tree' : 'popover'} aria-label="main navigation">
			{navigation.map((navigationItem: NavigationItem) => (
				<NavItem
					key={`router-${navigationItem.path}-${navigationItem.title}`}
					{...navigationItem}
				/>
			))}
		</DBControlPanelNavigation>
	);
};

export default MainNavigation;
