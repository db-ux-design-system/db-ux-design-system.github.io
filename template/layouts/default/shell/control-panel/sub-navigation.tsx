import {
  DBNavigation,
  DBShellSubNavigation,
} from "@db-ux/react-core-components";
import NavItem from "@template/layouts/default/shell/control-panel/nav-item.tsx";

const SubNavigation = ({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) => (
  <DBShellSubNavigation>
    <DBNavigation aria-label="sub navigation">
      {navigationItems.map((navigationItem: NavigationItem) => (
        <NavItem key={`sub-navigation-${navigationItem.path}-${navigationItem.path}`} {...navigationItem} />
      ))}
    </DBNavigation>
  </DBShellSubNavigation>
);

export default SubNavigation;
