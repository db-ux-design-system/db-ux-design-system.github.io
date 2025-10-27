import { type PropsWithChildren, type ReactElement } from "react";

import {
  DBControlPanelDesktop,
  DBControlPanelMobile,
  DBShell,
} from "@db-ux/react-core-components";
import PrimaryActions from "@template/layouts/default/shell/control-panel/primary-actions.tsx";
import MainNavigation from "@template/layouts/default/shell/control-panel/main-navigation.tsx";
import SubNavigation from "@template/layouts/default/shell/control-panel/sub-navigation.tsx";
import Brand from "@template/layouts/default/shell/control-panel/brand.tsx";
import { findSubNavigation } from "@template/utils/navigation.utils.ts";

export function Shell({ children }: PropsWithChildren): ReactElement {
  const subNavigation = findSubNavigation(window.location.pathname);

  /*
  * TODO: We need to get the subNavigation if we are inside a subNavigation Item as well
  * */

  return (
    <DBShell
      fadeIn
      subNavigationDesktopPosition="left"
      subNavigation={
        subNavigation ? <SubNavigation navigationItems={subNavigation} /> : null
      }
      subNavigationMobilePosition="none"
      controlPanelDesktop={
        <DBControlPanelDesktop
          brand={<Brand />}
          primaryActions={<PrimaryActions />}
        >
          <MainNavigation />
        </DBControlPanelDesktop>
      }
      controlPanelMobile={
        <DBControlPanelMobile
          brand={<Brand />}
          primaryActions={<PrimaryActions />}
        >
          <MainNavigation mobile />
        </DBControlPanelMobile>
      }
    >
      {children}
    </DBShell>
  );
}
