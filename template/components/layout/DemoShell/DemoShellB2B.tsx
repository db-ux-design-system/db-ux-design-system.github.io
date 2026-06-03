import { type PropsWithChildren, type ReactElement } from 'react';
import { DemoShell } from './DemoShell';
import DemoB2BNavigation from './control-panel/b2b/navigation';
import DemoB2BPrimaryActions from './control-panel/b2b/primary-actions';
import DemoB2BSecondaryActions from './control-panel/b2b/secondary-actions';
import DemoB2BSubNavigation from './control-panel/b2b/sub-navigation';

export function DemoShellB2B({ children }: PropsWithChildren): ReactElement {
	return (
		<DemoShell
			controlPanelDesktopPosition="left"
			subNavigationDesktopPosition="top"
			navigation={<DemoB2BNavigation />}
			primaryActions={<DemoB2BPrimaryActions />}
			secondaryActions={<DemoB2BSecondaryActions />}
			subNavigation={<DemoB2BSubNavigation />}
		>
			{children}
		</DemoShell>
	);
}
