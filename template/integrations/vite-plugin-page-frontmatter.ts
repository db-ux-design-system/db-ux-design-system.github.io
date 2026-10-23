import { readFile } from 'node:fs/promises';
import { parseFrontmatter } from 'astro/markdown';

/** Query that marks a glob import as "frontmatter only" (see {@link pageFrontmatterPlugin}). */
const PAGE_FRONTMATTER_QUERY_RE = /[?&]page-frontmatter(?:&|$)/;

/**
 * Minimal structural plugin type. Deliberately not imported from `vite`: the root
 * `node_modules/vite` is a stale copy and differs from the Vite version Astro uses.
 */
type FrontmatterPlugin = {
	name: string;
	enforce: 'pre';
	load(id: string): Promise<{ code: string; map: null; moduleType: 'js' } | undefined>;
};

/**
 * Serves the frontmatter of `.md`/`.mdx` pages as a dependency-free JSON module.
 *
 * Navigation and overview code needs page frontmatter only. Importing the page modules
 * themselves (e.g. via an eager `import.meta.glob`) pulls every page, including its
 * component and CSS imports, into the importer's module graph. Astro then attaches the
 * CSS of all those pages to every page that uses the importer.
 *
 * Usage: `import.meta.glob('…/*.{md,mdx}', { eager: true, query: '?raw&page-frontmatter', import: 'default' })`.
 * - The `raw` token makes Astro's markdown, MDX and `.astro` plugins skip the id. This
 *   `pre` plugin answers before Vite's own `?raw` handler.
 * - No `addWatchFile`: in dev it would register the page itself as an import of this
 *   module, and Astro's dev CSS collector would follow that edge into the page's CSS.
 *   Vite still invalidates this module when the file changes, because the module's file
 *   is the id without the query.
 *
 * The parse uses Astro's own frontmatter parser, so the result equals the page module's
 * `frontmatter` export.
 */
export function pageFrontmatterPlugin(): FrontmatterPlugin {
	return {
		name: 'db-page-frontmatter',
		enforce: 'pre',
		async load(id) {
			if (!PAGE_FRONTMATTER_QUERY_RE.test(id)) return undefined;
			const file = id.split('?')[0];
			if (!/\.mdx?$/.test(file)) {
				throw new Error(`[db-page-frontmatter] Only .md and .mdx files are supported: ${file}`);
			}
			const source = await readFile(file, 'utf-8');
			let frontmatter: Record<string, unknown>;
			try {
				({ frontmatter } = parseFrontmatter(source));
			} catch (error) {
				throw new Error(`[db-page-frontmatter] ${file}: ${(error as Error).message}`, {
					cause: error,
				});
			}
			return {
				code: `export default ${JSON.stringify(frontmatter)};`,
				map: null,
				moduleType: 'js',
			};
		},
	};
}
