import type { APIRoute } from 'astro';
import { appConfig } from '../../../app.config';

/**
 * Title, description and status of every English component page, keyed by
 * the component name of core-web (`button`, `drawer-footer`,
 * `control-panel-desktop`). The Storybook overview pages of core-web read it
 * at build time, so the summary and the status are maintained here only.
 */
type Frontmatter = {
	title?: string;
	description?: string;
	shortDescription?: string;
	status?: string;
};

type Component = {
	title: string;
	description?: string;
	shortDescription?: string;
	status?: string;
	url: string;
};

const pages = import.meta.glob<Frontmatter>('../documentation/components/**/*.mdx', {
	eager: true,
	import: 'frontmatter',
});

/**
 * core-web name of a page:
 * - `button.mdx`, `drawer/index.mdx`, `tabs/tabs.mdx` -> the file or folder name
 * - sub pages named like the component (`drawer/drawer-footer.mdx`,
 *   `tabs/tab-item.mdx`) -> the file name
 * - other sub pages (`control-panel/desktop.mdx`, `shell/content.mdx`)
 *   -> `<folder>-<file>`
 */
const toName = (path: string): string | undefined => {
	const [folder, file] = path
		.replace(/^\.\.\/documentation\/components\//, '')
		.replace(/\.mdx$/, '')
		.split('/');
	if (!file) {
		return folder === 'index' ? undefined : folder;
	}

	if (file === 'index' || file === folder) {
		return folder;
	}

	const stem = folder.replace(/s$/, '');
	return file.startsWith(`${stem}-`) ? file : `${folder}-${file}`;
};

const toUrl = (path: string): string =>
	`${appConfig.hostname}/documentation/components/${path
		.replace(/^\.\.\/documentation\/components\//, '')
		.replace(/(\/index)?\.mdx$/, '')}`;

const components: Record<string, Component> = {};
// A family folder has an `index.mdx` (overview of the family) and a page of
// the component itself (`drawer/drawer.mdx`, with the guidelines). The index
// comes first, the component page overrides it; fields only the index has
// (e.g. `shortDescription`) stay.
const isIndex = (path: string) => path.endsWith('/index.mdx');
const paths = Object.keys(pages).sort(
	(a, b) => Number(isIndex(b)) - Number(isIndex(a)) || a.localeCompare(b),
);
for (const path of paths) {
	const name = toName(path);
	const frontmatter = pages[path];
	if (!name || !frontmatter.title) {
		continue;
	}

	const defined = Object.fromEntries(
		Object.entries({
			title: frontmatter.title,
			description: frontmatter.description,
			shortDescription: frontmatter.shortDescription,
			status: frontmatter.status,
		}).filter(([, value]) => value !== undefined),
	);
	components[name] = { ...components[name], ...defined, url: toUrl(path) } as Component;
}

export const GET: APIRoute = () =>
	new Response(JSON.stringify(components, null, '\t'), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
