import { type PropsWithChildren, type ReactElement, type ReactNode, useMemo } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context.tsx';
import { LanguageProvider } from '@template/context/language-context.tsx';
import { toEnSlug } from '@template/i18n/slug-mapping';
import {
	DBControlPanelDesktop,
	DBControlPanelMobile,
	DBShell,
	DBShellContent,
} from '@db-ux/react-core-components';
import Actions1 from './control-panel/actions1.tsx';
import Actions2 from './control-panel/actions2.tsx';
import MainNavigation from './control-panel/main-navigation.tsx';
import SubNavigation from './control-panel/sub-navigation.tsx';
import Brand from './control-panel/brand.tsx';
import { findSubNavigation } from '@template/utils/navigation.utils.ts';
import { useTranslation } from '@template/i18n';

type Props = PropsWithChildren & {
	pathname?: string;
	/**
	 * Rendered into DBShellContent's endSlot, e.g. the page footer.
	 * Passed as an Astro named slot (`slot="endSlot"`).
	 */
	endSlot?: ReactNode;
};

export function Shell({ children, pathname = '/', endSlot }: Props): ReactElement {
	const normalizedPathname =
		toEnSlug(pathname.replace(/^\/de\//, '').replace(/^\/de$/, '')) ||
		pathname.replace(/^\/de/, '') ||
		'/';
	const subNavigation = useMemo(() => {
		return findSubNavigation(
			normalizedPathname.startsWith('/') ? normalizedPathname : `/${normalizedPathname}`,
		);
	}, [normalizedPathname]);

	/*
	 * TODO: We need to get the subNavigation if we are inside a subNavigation Item as well
	 * */

	return (
		<LanguageProvider pathname={pathname}>
			<ColorModeProvider>
				<ShellContent subNavigation={subNavigation} endSlot={endSlot}>
					{children}
				</ShellContent>
			</ColorModeProvider>
		</LanguageProvider>
	);
}

function ShellContent({
	children,
	subNavigation,
	endSlot,
}: PropsWithChildren & {
	subNavigation: NavigationItem[] | undefined;
	endSlot?: ReactNode;
}): ReactElement {
	const { t } = useTranslation();

	return (
		<DBShell subNavigationDesktopPosition="left" subNavigationMobilePosition="none">
			<DBControlPanelDesktop brand={<Brand />} actions1={<Actions1 />} actions2={<Actions2 />}>
				<MainNavigation />
			</DBControlPanelDesktop>
			<DBControlPanelMobile
				burgerMenuLabel={t('shell.menu')}
				brand={<Brand />}
				actions1={<Actions2 />}
				actions2={<Actions1 />}
			>
				<MainNavigation mobile />
			</DBControlPanelMobile>
			{subNavigation ? <SubNavigation navigationItems={subNavigation} /> : null}
			<DBShellContent endSlot={endSlot}>{children}</DBShellContent>
		</DBShell>
	);
}
