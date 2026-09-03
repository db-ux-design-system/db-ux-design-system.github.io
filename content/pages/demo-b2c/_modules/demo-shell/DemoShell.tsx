import { type PropsWithChildren, type ReactElement } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context';
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
import DemoActions1 from './control-panel/actions1';
import DemoActions2 from './control-panel/actions2';
import { useDemoUrlParams } from '@template/hooks/useDemoUrlParams';

function DemoShellContent({ children }: PropsWithChildren): ReactElement {
	useDemoUrlParams();

	return (
		<DBShell fadeIn controlPanelDesktopPosition="top" subNavigationDesktopPosition="top">
			<DBControlPanelDesktop
				brand={<DemoBrand />}
				meta={<DemoMetaNavigation />}
				actions1={<DemoActions1 />}
				actions2={<DemoActions2 />}
			>
				<DemoNavigation />
			</DBControlPanelDesktop>
			<DBControlPanelMobile
				burgerMenuLabel="Menu"
				brand={<DemoBrand />}
				meta={<DemoMetaNavigation />}
				actions1={<DemoActions1 />}
				actions2={<DemoActions2 />}
			>
				<DemoNavigation />
			</DBControlPanelMobile>
			<DBShellContent>{children}</DBShellContent>
		</DBShell>
	);
}

export function DemoShell({ children }: PropsWithChildren): ReactElement {
	return (
		<ThemeProvider>
			<ColorModeProvider>
				<DemoShellContent>{children}</DemoShellContent>
			</ColorModeProvider>
		</ThemeProvider>
	);
}
