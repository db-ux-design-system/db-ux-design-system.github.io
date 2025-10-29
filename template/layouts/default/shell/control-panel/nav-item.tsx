import { DBNavigationItem, DBNavigationItemGroup } from "@db-ux/react-core-components";
import { getAriaCurrent } from "@template/utils/client.utils.ts";
import { covers, getFirstChildPath } from "@template/utils/navigation.utils.ts";

const NavItem = ({ path, title, icon, iconTrailing, children, isSubNavigation }: NavigationItem) => {
    // if sub-navigation node, do not render children here
    if (isSubNavigation) {
        const target = path ?? getFirstChildPath(children);
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
        const isActive = covers({ path, title, icon, iconTrailing, children, isSubNavigation }, currentPath);

        return (
            <DBNavigationItem icon={icon} key={`router-leaf-${target ?? title}`}>
                <a
                    href={target}
                    aria-current={isActive ? "page" : undefined}
                    data-icon-trailing={iconTrailing}
                >
                    {title}
                </a>
            </DBNavigationItem>
        );
    }

    // node with children
    if (children && children.length > 0) {
        return (
            <DBNavigationItemGroup text={title} key={`router-group-${path ?? title}`}>
                {children.map((subItem) => (
                    <NavItem key={`router-sub-path-${subItem.path ?? subItem.title}`} {...subItem} />
                ))}
            </DBNavigationItemGroup>
        );
    }

    // leaf-node, no children
    return (
        <DBNavigationItem icon={icon} key={`router-leaf-${path ?? title}`}>
            <a
                href={path}
                aria-current={path ? getAriaCurrent(path) : undefined}
                data-icon-trailing={iconTrailing}
            >
                {title}
            </a>
        </DBNavigationItem>
    );
};

export default NavItem;
