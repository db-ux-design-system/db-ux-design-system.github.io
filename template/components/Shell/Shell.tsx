import { type PropsWithChildren, type ReactElement, useMemo } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context.tsx';
import { LanguageProvider } from '@template/context/language-context.tsx';
import { toEnSlug } from '@template/i18n/slug-mapping';
import { DBControlPanelDesktop, DBControlPanelMobile, DBShell } from '@db-ux/react-core-components';
import PrimaryActions from './control-panel/primary-actions.tsx';
import SecondaryActions from './control-panel/secondary-actions.tsx';
import MainNavigation from './control-panel/main-navigation.tsx';
import SubNavigation from './control-panel/sub-navigation.tsx';
import Brand from './control-panel/brand.tsx';
import { findSubNavigation } from '@template/utils/navigation.utils.ts';
import { useTranslation } from '@template/i18n';
import type { NavigationItemGroupVariantType } from '@db-ux/react-core-components/dist/shared/model';

type Props = PropsWithChildren & {
	pathname?: string;
	subNavigationVariant?: NavigationItemGroupVariantType;
};

export function Shell({ children, pathname = '/', subNavigationVariant }: Props): ReactElement {
	const normalizedPathname = toEnSlug(pathname.replace(/^\/de\//, '').replace(/^\/de$/, '')) || pathname.replace(/^\/de/, '') || '/';
	const subNavigation = useMemo(() => {
		return findSubNavigation(normalizedPathname.startsWith('/') ? normalizedPathname : `/${normalizedPathname}`);
	}, [normalizedPathname]);

	/*
	 * TODO: We need to get the subNavigation if we are inside a subNavigation Item as well
	 * */

	return (
		<LanguageProvider pathname={pathname}>
		<ColorModeProvider>
			<ShellContent subNavigationVariant={subNavigationVariant} subNavigation={subNavigation}>
				{children}
			</ShellContent>
		</ColorModeProvider>
		</LanguageProvider>
	);
}

function ShellContent({
	children,
	subNavigation,
	subNavigationVariant,
}: PropsWithChildren & {
	subNavigation: NavigationItem[] | undefined;
	subNavigationVariant?: NavigationItemGroupVariantType;
}): ReactElement {
	const { t } = useTranslation();

	return (
		<DBShell
			subNavigationDesktopPosition="left"
			subNavigationMobilePosition="none"
		>
			<DBControlPanelDesktop brand={<Brand />} primaryActions={<PrimaryActions />} secondaryActions={<SecondaryActions />}>
				<MainNavigation />
			</DBControlPanelDesktop>
			{/* eslint-disable-next-line db-ux/control-panel-mobile-burger-menu-label-required */}
			<DBControlPanelMobile
				burgerMenuLabel={t('shell.menu')}
				brand={<Brand />}
				primaryActions={<PrimaryActions />}
				secondaryActions={<SecondaryActions />}
			>
				<MainNavigation mobile />
			</DBControlPanelMobile>
			{subNavigation ? (
				<SubNavigation navigationItems={subNavigation} variant={subNavigationVariant} />
			) : null}
			{children}
		</DBShell>
	);
}
