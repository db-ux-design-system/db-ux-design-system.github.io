/**
 * Page entry in the shape navigation/overview code reads: md/mdx frontmatter is exposed as
 * `frontmatter`, `.astro` page modules are passed through unchanged.
 */
export type PageSource<T> = {
	frontmatter?: T;
	default?: { frontmatter?: T };
};

/**
 * Merges md/mdx frontmatter (loaded via the `?raw&page-frontmatter` glob query, see
 * `template/integrations/vite-plugin-page-frontmatter.ts`) with eagerly imported `.astro`
 * page modules into one record.
 *
 * Keys are sorted by code-unit order, the same order a single `import.meta.glob` over all
 * extensions returns, so consumers iterate the pages exactly as before the split.
 *
 * @param frontmatters - Frontmatter objects of md/mdx pages, keyed by file path.
 * @param astroModules - `.astro` page modules, keyed by file path.
 * @returns All pages, keyed by file path, in sorted order.
 */
export function mergePageSources<T, M extends PageSource<T>>(
	frontmatters: Record<string, T>,
	astroModules: Record<string, M> = {},
): Record<string, PageSource<T>> {
	const all: Record<string, PageSource<T>> = { ...astroModules };
	for (const [key, frontmatter] of Object.entries(frontmatters)) {
		all[key] = { frontmatter };
	}

	const merged: Record<string, PageSource<T>> = {};
	for (const key of Object.keys(all).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
		merged[key] = all[key];
	}
	return merged;
}
