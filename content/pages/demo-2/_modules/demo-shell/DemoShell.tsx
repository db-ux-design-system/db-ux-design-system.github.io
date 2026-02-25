import { type PropsWithChildren, type ReactElement, useEffect } from 'react';
import { ColorModeProvider, useColorMode } from '@template/context/color-mode-context';
import { ThemeProvider, useTheme } from '@template/context/theme-context';
import './DemoShell.css';
import {
	DBShell,
	DBControlPanelDesktop,
	DBControlPanelMobile,
	DBNotification,
	DBNavigation,
	DBNavigationItem,
	DBShellSubNavigation,
} from '@db-ux/react-core-components';
import DemoBrand from './control-panel/brand';
import DemoMetaNavigation from './control-panel/meta-navigation';
import DemoNavigation from './control-panel/navigation';
import DemoPrimaryActions from './control-panel/primary-actions';
import DemoSecondaryActions from './control-panel/secondary-actions';
import DemoSubNavigation from './control-panel/sub-navigation.tsx';

function DemoShellContent({ children }: PropsWithChildren): ReactElement {
	const { setColorMode } = useColorMode();
	const { setTheme } = useTheme();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const mode = params.get('mode');
		const theme = params.get('theme');

		if (mode === 'light' || mode === 'dark') {
			setColorMode(mode);
			document.documentElement.setAttribute('data-mode', mode);
		}

		if (theme) {
			setTheme(theme);
		}
	}, [setColorMode, setTheme]);

	return (
		<DBShell
			fadeIn
			controlPanelDesktopPosition="top"
			subNavigationDesktopPosition="top"
			controlPanelDesktop={
				<DBControlPanelDesktop
					brand={<DemoBrand />}
					metaNavigation={<DemoMetaNavigation />}
					primaryActions={<DemoPrimaryActions />}
					secondaryActions={<DemoSecondaryActions />}
				>
					<DemoNavigation />
				</DBControlPanelDesktop>
			}
			controlPanelMobile={
				<DBControlPanelMobile
					brand={<DemoBrand />}
					metaNavigation={<DemoMetaNavigation />}
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
