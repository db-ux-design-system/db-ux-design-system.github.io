import { appConfig } from "@root/app.config";
import { appNavigation } from "@root/app.navigation";

/**
 * Returns the parent of a navigation item based on the given pathname.
 * @param pathname - The pathname to find the parent for.
 * @returns The parent navigation item or undefined if none is found.
 */
export function getNavigationItemParent(
  pathname: string,
): NavigationItem | undefined {
  const { basePath } = appConfig;
  const _pathname = pathname.replace(/\/+$/, "");

  return appNavigation.filter((item) => {
    const children = [...(item.children ?? []), ...(item.subNavigation ?? [])];
    if (children.length > 0) {
      return children.some((child) => {
        const fullPath = `${basePath}${child.path}`.replace(/\/+$/, "");
        return fullPath === _pathname;
      });
    }
    return false;
  })[0];
}

/**
 * Recursively searches for a subNavigation array with at least one entry for the given pathname.
 * @param pathname - The pathname to check.
 * @returns The subNavigation array if found, otherwise undefined.
 */
export function findSubNavigation(
  pathname: string,
): NavigationItem[] | undefined {
  const { basePath } = appConfig;
  const _pathname = pathname.replace(/\/+$/, "");

  function checkRecursive(item: NavigationItem | undefined): NavigationItem[] | undefined {
    if (!item) return undefined;
    const fullPath = `${basePath}${item.path}`.replace(/\/+$/, "");
    if (fullPath === _pathname && Array.isArray(item.subNavigation) && item.subNavigation.length > 0) {
      return item.subNavigation;
    }
    const children = [...(item.children ?? []), ...(item.subNavigation ?? [])];
    for (const child of children) {
      const result = checkRecursive(child);
      if (result) return result;
    }
    return undefined;
  }

  for (const navItem of appNavigation) {
    const result = checkRecursive(navItem);
    if (result) return result;
  }
  return undefined;
}
