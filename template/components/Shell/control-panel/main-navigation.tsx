import { DBControlPanelNavigation } from '@db-ux/react-core-components';
import { buildAppNavigationFromContent } from '@template/utils/content-navigation.ts';
import { useTranslation } from '@template/i18n';
import NavItem from './nav-item.tsx';

const MainNavigation = ({ mobile }: { mobile?: boolean }) => {
	const navigation = buildAppNavigationFromContent(mobile);
	const { t } = useTranslation();

	return (
		<DBControlPanelNavigation variant={mobile ? 'tree' : 'popover'} aria-label={t('shell.mainNavigation')}>
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
