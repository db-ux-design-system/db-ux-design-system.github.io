import { type PropsWithChildren, type ReactElement, useMemo } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context.tsx';
import { DBControlPanelDesktop, DBControlPanelMobile, DBShell } from '@db-ux/react-core-components';
import PrimaryActions from './control-panel/primary-actions.tsx';
import MainNavigation from './control-panel/main-navigation.tsx';
import SubNavigation from './control-panel/sub-navigation.tsx';
import Brand from './control-panel/brand.tsx';
import { findSubNavigation } from '@template/utils/navigation.utils.ts';
import type { NavigationItemGroupVariantType } from '@db-ux/react-core-components/dist/shared/model';

type Props = PropsWithChildren & {
	pathname?: string;
	subNavigationVariant?: NavigationItemGroupVariantType;
};

export function Shell({ children, pathname = '/', subNavigationVariant }: Props): ReactElement {
	const subNavigation = useMemo(() => {
		return findSubNavigation(pathname);
	}, [pathname]);

	/*
	 * TODO: We need to get the subNavigation if we are inside a subNavigation Item as well
	 * */

	return (
		<ColorModeProvider>
			<DBShell
				subNavigationDesktopPosition="left"
				subNavigation={
					subNavigation ? (
						<SubNavigation navigationItems={subNavigation} variant={subNavigationVariant} />
					) : null
				}
				subNavigationMobilePosition="none"
				controlPanelDesktop={
					<DBControlPanelDesktop brand={<Brand />} primaryActions={<PrimaryActions />}>
						<MainNavigation />
					</DBControlPanelDesktop>
				}
				controlPanelMobile={
					<DBControlPanelMobile brand={<Brand />} primaryActions={<PrimaryActions />}>
						<MainNavigation mobile />
					</DBControlPanelMobile>
				}
			>
				{children}
			</DBShell>
		</ColorModeProvider>
	);
}
