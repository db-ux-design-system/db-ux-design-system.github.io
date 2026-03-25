import { type PropsWithChildren, type ReactElement } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context';
import { ThemeProvider } from '@template/context/theme-context';
import { DBShell, DBControlPanelDesktop, DBControlPanelMobile } from '@db-ux/react-core-components';
import DemoBrand from '@template/components/DemoBrand/DemoBrand';
import DemoNavigation from './control-panel/navigation';
import DemoPrimaryActions from './control-panel/primary-actions';
import DemoSecondaryActions from './control-panel/secondary-actions';
import DemoSubNavigation from './control-panel/sub-navigation.tsx';
import { useDemoUrlParams } from '@template/hooks/useDemoUrlParams';

function DemoShellContent({ children }: PropsWithChildren): ReactElement {
	useDemoUrlParams();

	return (
		<DBShell
			fadeIn
			controlPanelDesktopPosition="left"
			subNavigationDesktopPosition="top"
			subNavigation={<DemoSubNavigation />}
			controlPanelDesktop={
				<DBControlPanelDesktop brand={<DemoBrand />} secondaryActions={<DemoSecondaryActions />}>
					<DemoNavigation />
				</DBControlPanelDesktop>
			}
			controlPanelMobile={
				<DBControlPanelMobile
					brand={<DemoBrand />}
					primaryActions={<DemoPrimaryActions />}
					secondaryActions={<DemoSecondaryActions />}
				>
					<DemoNavigation />
				</DBControlPanelMobile>
			}
		>
			{children}
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
