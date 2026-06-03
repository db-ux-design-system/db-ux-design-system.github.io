import { type PropsWithChildren, type ReactElement, type ReactNode } from 'react';
import { ColorModeProvider } from '@template/context/color-mode-context';
import { ThemeProvider } from '@template/context/theme-context';
import { DBShell, DBControlPanelDesktop, DBControlPanelMobile } from '@db-ux/react-core-components';
import DemoBrand from '@template/components/theming/DemoBrand/DemoBrand';
import { useDemoUrlParams } from '@template/hooks/useDemoUrlParams';

export type DemoShellProps = PropsWithChildren<{
	controlPanelDesktopPosition?: 'left' | 'top';
	subNavigationDesktopPosition?: 'left' | 'top';
	navigation: ReactNode;
	primaryActions?: ReactNode;
	secondaryActions?: ReactNode;
	metaNavigation?: ReactNode;
	subNavigation?: ReactNode;
}>;

function DemoShellContent({
	children,
	controlPanelDesktopPosition = 'top',
	subNavigationDesktopPosition = 'top',
	navigation,
	primaryActions,
	secondaryActions,
	metaNavigation,
	subNavigation,
}: DemoShellProps): ReactElement {
	useDemoUrlParams();

	return (
		<DBShell
			fadeIn
			controlPanelDesktopPosition={controlPanelDesktopPosition}
			subNavigationDesktopPosition={subNavigationDesktopPosition}
			subNavigation={subNavigation}
			controlPanelDesktop={
				<DBControlPanelDesktop
					brand={<DemoBrand />}
					metaNavigation={metaNavigation}
					primaryActions={primaryActions}
					secondaryActions={secondaryActions}
				>
					{navigation}
				</DBControlPanelDesktop>
			}
			controlPanelMobile={
				<DBControlPanelMobile
					brand={<DemoBrand />}
					metaNavigation={metaNavigation}
					primaryActions={primaryActions}
					secondaryActions={secondaryActions}
				>
					{navigation}
				</DBControlPanelMobile>
			}
		>
			{children}
		</DBShell>
	);
}

export function DemoShell({ children, ...props }: DemoShellProps): ReactElement {
	return (
		<ThemeProvider>
			<ColorModeProvider>
				<DemoShellContent {...props}>{children}</DemoShellContent>
			</ColorModeProvider>
		</ThemeProvider>
	);
}
