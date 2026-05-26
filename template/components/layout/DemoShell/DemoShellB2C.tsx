import { type PropsWithChildren, type ReactElement } from 'react';
import { DemoShell } from './DemoShell';
import DemoB2CNavigation from './control-panel/b2c/navigation';
import DemoB2CPrimaryActions from './control-panel/b2c/primary-actions';
import DemoB2CSecondaryActions from './control-panel/b2c/secondary-actions';
import DemoB2CMetaNavigation from './control-panel/b2c/meta-navigation';

export function DemoShellB2C({ children }: PropsWithChildren): ReactElement {
	return (
		<DemoShell
			controlPanelDesktopPosition="top"
			subNavigationDesktopPosition="top"
			navigation={<DemoB2CNavigation />}
			primaryActions={<DemoB2CPrimaryActions />}
			secondaryActions={<DemoB2CSecondaryActions />}
			metaNavigation={<DemoB2CMetaNavigation />}
		>
			{children}
		</DemoShell>
	);
}
