import { DBButton, DBIcon } from '@db-ux/react-core-components';
import { appConfig } from '@root/app.config';
import { getCurrentPathname } from '@root/template/utils/app.utils';
import { getNavigationItemParent } from '@root/template/utils/navigation.utils';
import type { ReactElement } from 'react';

export function FooterNav(): ReactElement | null {
	const currentPathname = getCurrentPathname();
	const parent = getNavigationItemParent(currentPathname);
	const siblings = parent?.children;
	const getCurrentIndex = (): number => {
		return parent?.children?.findIndex((item) => {
			const fullPath = `${appConfig.basePath}${item.path}`.replace(/\/+$/, '');
			return fullPath === currentPathname;
		})!;
	};
	const currentIndex = getCurrentIndex();
	if (!parent || !siblings) return null;

	const getPreviousNavItem = (): NavigationItem | undefined => {
		return currentIndex > 0 ? siblings[currentIndex - 1] : undefined;
	};
	const previousNavItem = getPreviousNavItem();

	const getNextNavItem = (): NavigationItem | undefined => {
		return currentIndex < siblings?.length - 1 ? siblings[currentIndex + 1] : undefined;
	};
	const nextNavItem = getNextNavItem();

	return (
		<footer className="dba-main-footer-nav">
			{previousNavItem && (
				<a href={previousNavItem.path} aria-label={previousNavItem.title}>
					<DBButton aria-hidden="true">
						<DBIcon icon="arrow_left" />
						{previousNavItem.title}
					</DBButton>
				</a>
			)}
			{nextNavItem && (
				<a href={nextNavItem.path} aria-label={nextNavItem.title}>
					<DBButton aria-hidden="true">
						{nextNavItem.title}
						<DBIcon icon="arrow_right" />
					</DBButton>
				</a>
			)}
		</footer>
	);
}
