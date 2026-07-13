import { type PropsWithChildren, type ReactElement } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context';
import { LanguageProvider } from '@template/context/language-context';
import { ThemeProvider } from '@template/context/theme-context';
import {
	DBShell,
	DBControlPanelDesktop,
	DBControlPanelMobile,
	DBShellContent,
} from '@db-ux/react-core-components';
import DemoBrand from '@template/components/DemoBrand/DemoBrand';
import DemoMetaNavigation from './control-panel/meta-navigation';
import DemoNavigation from './control-panel/navigation';
import DemoPrimaryActions from './control-panel/primary-actions';
import DemoSecondaryActions from './control-panel/secondary-actions';
import { useDemoUrlParams } from '@template/hooks/useDemoUrlParams';

function DemoShellContent({ children }: PropsWithChildren): ReactElement {
	useDemoUrlParams();

	return (
		<DBShell fadeIn controlPanelDesktopPosition="top" subNavigationDesktopPosition="top">
			<DBControlPanelDesktop
				brand={<DemoBrand />}
				metaNavigation={<DemoMetaNavigation />}
				primaryActions={<DemoPrimaryActions />}
				secondaryActions={<DemoSecondaryActions />}
			>
				<DemoNavigation />
			</DBControlPanelDesktop>
			<DBControlPanelMobile
				burgerMenuLabel="Menu"
				brand={<DemoBrand />}
				metaNavigation={<DemoMetaNavigation />}
				primaryActions={<DemoPrimaryActions />}
				secondaryActions={<DemoSecondaryActions />}
			>
				<DemoNavigation />
			</DBControlPanelMobile>
			<DBShellContent>{children}</DBShellContent>
		</DBShell>
	);
}

export function DemoShell({ children }: PropsWithChildren): ReactElement {
	return (
		<LanguageProvider>
		<ThemeProvider>
			<ColorModeProvider>
				<DemoShellContent>{children}</DemoShellContent>
			</ColorModeProvider>
		</ThemeProvider>
		</LanguageProvider>
	);
}
