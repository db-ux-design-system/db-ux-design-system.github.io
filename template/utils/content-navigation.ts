type NavigationFrontmatter = FrontMatter & {
	hidePage?: boolean;
	isSubNavigation?: boolean;
	iconTrailing?: string;
	isMenuItemDisabled?: boolean;
	order?: number;
	nav?: boolean | { order?: number };
};

type MdModule = { frontmatter: NavigationFrontmatter };
type Modules = Record<string, MdModule>;

/**
 * Converts an absolute file path into a relative route path (without leading slash).
 *
 * @param path - Absolute or relative path to a Markdown file.
 * @returns A normalized relative path without a leading slash ("" for root).
 */
function strip(path: string): string {
	const unix = path.replace(/\\/g, '/');
	const withoutPrefix = unix.replace(/^.*content\/pages\//, '');
	return withoutPrefix.replace(/(?:\/index\.(md|mdx)|^index\.(md|mdx))$/, '');
}

/**
 * Converts a URL segment (e.g. kebab-case) into a readable title.
 *
 * @param segment - The URL segment to convert.
 * @returns A human-friendly title string.
 */
function toTitleFromSegment(segment: string): string {
	return segment
		.split('-')
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(' ');
}

/**
 * Ensures a navigation item has a given child node. Adds the child if it does not already exist (based on `path`).
 *
 * @param parent - The parent navigation item.
 * @param child - The child item to add if missing.
 */
function ensureChild(parent: NavigationItem, child: NavigationItem) {
	parent.children = parent.children ?? [];
	const exists = parent.children.find((c) => c.path === child.path);
	if (!exists) parent.children.push(child);
}

/**
 * Extracts an optional numeric ordering value (`order`) from frontmatter.
 *
 * @param fm - The frontmatter object.
 * @returns A number representing the sort order, or `undefined` if not set.
 */
function getOrder(fm: NavigationFrontmatter): number | undefined {
	if (typeof fm?.order === 'number') return fm.order;
	return undefined;
}

/**
 * Comparator function for sorting navigation items. First by `order`, then alphabetically by `title`.
 *
 * @param a - The first navigation item.
 * @param b - The second navigation item.
 * @returns -1, 0, or 1 depending on order.
 */
function compareNav(a: NavigationItem, b: NavigationItem) {
	const ao = a.order ?? Number.MAX_SAFE_INTEGER;
	const bo = b.order ?? Number.MAX_SAFE_INTEGER;
	if (ao !== bo) return ao - bo;
	return (a.title || '').localeCompare(b.title || '');
}

/**
 * Recursively sorts a navigation tree. Sorts all children of a node using `compareNav` and calls itself recursively
 * for all descendants.
 *
 * @param node - Root or intermediate node of the navigation tree.
 */
function sortTree(node: NavigationItem) {
	if (node.children?.length) {
		node.children.sort(compareNav);
		node.children.forEach(sortTree);
	}
}

/**
 * Builds the complete application navigation dynamically from Markdown content.
 * Scans all markdown files, skips the root homepage, reads the frontmatter, creates intermediate nodes for
 * directories without their own index file and recursively sorts all items by order and title.
 *
 * @returns A fully structured and sorted `AppNavigation` tree.
 */
export function buildAppNavigationFromContent(): AppNavigation {
	const mods = import.meta.glob<MdModule>('../../content/pages/**/*.{md,mdx}', {
		eager: true,
	}) as Modules;
	const nodes = new Map<string, NavigationItem>();

	for (const [key, mod] of Object.entries(mods)) {
		const rel = strip(key);
		const segments = rel.split('/').filter(Boolean);
		const fm: NavigationFrontmatter = mod.frontmatter ?? ({} as NavigationFrontmatter);

		if (rel === '') continue;
		if (fm.nav === false) continue;

		const title =
			fm.title || (segments.length ? toTitleFromSegment(segments[segments.length - 1]) : 'Home');
		const hidePage = fm.hidePage === true;
		const isSubNavigation = fm.isSubNavigation ?? false;
		const iconTrailing = fm.iconTrailing;
		const disabled = fm.isMenuItemDisabled === true;
		const order = getOrder(fm);

		const node: NavigationItem = {
			title,
			path: hidePage ? undefined : rel,
			isSubNavigation,
			iconTrailing,
			children: [],
			disabled,
			order,
		};

		nodes.set(rel, node);

		for (let i = 1; i < segments.length; i++) {
			const parentKey = segments.slice(0, i).join('/');
			if (!nodes.has(parentKey)) {
				const parentNode: NavigationItem = {
					title: toTitleFromSegment(segments[i - 1]),
					path: parentKey,
					children: [],
				};
				nodes.set(parentKey, parentNode);
			}
		}
	}

	const roots: Record<string, NavigationItem> = {};
	for (const [rel, node] of nodes) {
		const segments = rel.split('/').filter(Boolean);
		if (segments.length <= 1) {
			roots[rel] = roots[rel] ?? node;
		} else {
			const parentKey = segments.slice(0, segments.length - 1).join('/');
			const parent = nodes.get(parentKey);
			if (parent) ensureChild(parent, node);
		}
	}

	const appNav: AppNavigation = Object.values(roots).sort(compareNav);
	appNav.forEach(sortTree);

	return appNav;
}
