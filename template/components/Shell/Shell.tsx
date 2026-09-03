import { type PropsWithChildren, type ReactElement, type ReactNode, useMemo } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context.tsx';
import { LanguageProvider } from '@template/context/language-context.tsx';
import { toEnSlug } from '@template/i18n/slug-mapping';
import {
	DBControlPanelActions1,
	DBControlPanelActions2,
	DBControlPanelDesktop,
	DBControlPanelMobile,
	DBShell,
	DBShellContent,
} from '@db-ux/react-core-components';
import ContactUs from './control-panel/contact-us.tsx';
import PreferenceSwitches from './control-panel/preference-switches.tsx';
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
			{/* The actions slot decides the position, so the same content sits in a
			    different slot per breakpoint. Desktop splits it up: switches left
			    (Actions 1), contact button right (Actions 2). Mobile puts both into
			    the drawer footer (Actions 2) as one row, which keeps the menu bar
			    free for the brand and the burger button. Keeping the footer a single
			    row matters: the drilldown overlay reserves a fixed height for it, so
			    a taller footer would be covered by the overlay. The wrapper has to
			    match its slot because it carries the grid area. */}
			<DBControlPanelDesktop
				brand={<Brand />}
				actions1={
					<DBControlPanelActions1>
						<PreferenceSwitches />
					</DBControlPanelActions1>
				}
				actions2={
					<DBControlPanelActions2>
						<ContactUs />
					</DBControlPanelActions2>
				}
			>
				<MainNavigation />
			</DBControlPanelDesktop>
			<DBControlPanelMobile
				burgerMenuLabel={t('shell.menu')}
				brand={<Brand />}
				actions2={
					<DBControlPanelActions2>
						<ContactUs />
						<PreferenceSwitches />
					</DBControlPanelActions2>
				}
			>
				<MainNavigation mobile />
			</DBControlPanelMobile>
			{subNavigation ? <SubNavigation navigationItems={subNavigation} /> : null}
			<DBShellContent endSlot={endSlot}>{children}</DBShellContent>
		</DBShell>
	);
}
