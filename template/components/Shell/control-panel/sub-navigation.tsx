import { DBControlPanelNavigation, DBShellSubNavigation } from '@db-ux/react-core-components';
import { useTranslation } from '@template/i18n';
import NavItem from './nav-item.tsx';

const SubNavigation = ({ navigationItems }: { navigationItems: NavigationItem[] }) => {
	const { t } = useTranslation();
	return (
		// The expand/collapse button of the sidebar falls back to the English library
		// texts ("Collapse"/"Expand"), so the tooltip is passed per language.
		<DBShellSubNavigation
			aria-label={t('shell.subNavigation')}
			expandButtonTooltipFn={(open) =>
				open ? t('shell.subNavigation.collapse') : t('shell.subNavigation.expand')
			}
		>
			<DBControlPanelNavigation aria-label={t('shell.subNavigation')} variant="drilldown">
				{navigationItems.map((navigationItem: NavigationItem) => (
					<NavItem
						{...navigationItem}
						icon={navigationItem.icon}
						key={`sub-navigation-${navigationItem.path}-${navigationItem.path}`}
					/>
				))}
			</DBControlPanelNavigation>
		</DBShellSubNavigation>
	);
};
export default SubNavigation;
