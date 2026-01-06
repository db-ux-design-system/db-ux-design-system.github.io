import { appConfig } from '@root/app.config';
import { appNavigation } from '@root/app.navigation';

/**
 * Normalizes a path by removing trailing slashes.
 *
 * @param path - The path to normalize
 * @returns The normalized path without trailing slashes
 */
const norm = (path: string) => path.replace(/\/+$/, '');

/**
 * Prepends the base path to a relative path and normalizes the result.
 *
 * @param relPath - The relative path to prepend the base path to
 * @returns The normalized absolute path including the base path
 */
function withBase(relPath: string) {
	const base = norm(appConfig.basePath || '/');
	const rel = relPath.startsWith('/') ? relPath : `/${relPath}`;
	return norm(`${base}${rel}`);
}

/**
 * Returns the path of the first child navigation item, if any.
 * @param children - An array of navigation items.
 * @returns The path of the first child navigation item or undefined if there are no children.
 */
export function getFirstChildPath(children?: NavigationItem[]): string | undefined {
	return children && children.length > 0 ? children[0]?.path : undefined;
}

/**
 * Checks if a navigation item or any of its descendants covers the current path.
 * A path is considered "covered" if it either exactly matches or is a sub-path of the navigation item's path.
 *
 * @param item - The navigation item to check
 * @param currentPath - The current path to compare against
 * @returns {boolean} True if the item or its descendants cover the current path, false otherwise
 */
export function covers(item: NavigationItem, currentPath: string): boolean {
	if (item.path) {
		const full = withBase(item.path);
		if (currentPath === full || currentPath.startsWith(full + '/')) return true;
	}
	for (const child of item.children ?? []) {
		if (covers(child, currentPath)) return true;
	}
	return false;
}

/**
 * Finds the children of the deepest sub-navigation item that covers the current pathname.
 *
 * @param currentPathname - The current pathname to find sub-navigation for
 * @returns An array of navigation items if a matching sub-navigation is found, undefined otherwise
 */
export function findSubNavigation(currentPathname: string): NavigationItem[] | undefined {
	const current = norm(currentPathname);
	let match: { node: NavigationItem; depth: number } | undefined;

	const walk = (node: NavigationItem, depth: number) => {
		if (node.isSubNavigation && covers(node, current)) {
			if (!match || depth > match.depth) match = { node, depth };
		}
		for (const child of node.children ?? []) walk(child, depth + 1);
	};

	for (const top of appNavigation) walk(top, 0);
	return match?.node.children;
}

/**
 * Finds the parent navigation item for a given pathname.
 *
 * @param pathname - The pathname to find the parent for
 * @returns The parent navigation item if found, undefined otherwise
 */
export function getNavigationItemParent(pathname: string): NavigationItem | undefined {
	const { basePath } = appConfig;
	const norm = (p: string) => p.replace(/\/+$/, '');
	const _pathname = norm(pathname);

	const withBase = (relPath?: string) => {
		if (!relPath) return undefined;
		const base = norm(basePath || '/');
		const rel = relPath.startsWith('/') ? relPath : `/${relPath}`;
		return norm(`${base}${rel}`);
	};

	const findParent = (nodes: NavigationItem[]): NavigationItem | undefined => {
		for (const node of nodes) {
			const children = node.children ?? [];
			for (const child of children) {
				const full = withBase(child.path);
				if (full && full === _pathname) {
					return node;
				}
			}
			const found = findParent(children);
			if (found) return found;
		}
		return undefined;
	};

	return findParent(appNavigation);
}
