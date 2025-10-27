
import {
  DBNavigationItem,
  DBNavigationItemGroup,
} from "@db-ux/react-core-components";
import { getAriaCurrent } from "@template/utils/client.utils.ts";

const NavItem = ({
  path,
  title,
  icon,iconTrailing,
  children,
}: NavigationItem) => {
  if (children) {
    return (
      <DBNavigationItemGroup text={title} key={`router-path-${path}-${title}`}>
        {children.map((subItem) => (
          <NavItem key={`router-sub-path-${subItem.path}`} {...subItem} />
        ))}
      </DBNavigationItemGroup>
    );
  }

  return (
    <DBNavigationItem icon={icon} key={`router-path-${path}-${title}`}>
      <a
        href={path}
        aria-current={getAriaCurrent(path)}
        data-icon-trailing={iconTrailing}
      >
        {title}
      </a>
    </DBNavigationItem>
  );
};

export default NavItem;
