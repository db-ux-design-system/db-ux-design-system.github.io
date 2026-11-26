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
	/** Index pages of a family that only forward to one of its pages. */
	redirectTo?: string;
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

const fields = (frontmatter: Frontmatter) =>
	Object.fromEntries(
		Object.entries({
			title: frontmatter.title,
			description: frontmatter.description,
			shortDescription: frontmatter.shortDescription,
			status: frontmatter.status,
		}).filter(([, value]) => value !== undefined),
	);

const isIndex = (path: string) => path.endsWith('/index.mdx');
const indexOf = (path: string) => path.replace(/[^/]+\.mdx$/, 'index.mdx');
/** Page a `redirectTo` path (`/documentation/components/shell/desktop`) points to. */
const pathOf = (redirectTo: string) =>
	Object.keys(pages).find((path) => toUrl(path) === `${appConfig.hostname}${redirectTo}`);

const components: Record<string, Component> = {};
// A family folder has an `index.mdx` (overview of the family) and its pages.
// - The index comes first, the page named like the folder (`drawer/drawer.mdx`)
//   overrides it; fields only the index has (e.g. `shortDescription`) stay.
// - An index that only redirects takes the missing fields and the URL of its
//   target page, e.g. `shell` the description and URL of `shell/desktop.mdx`.
// - Pages without a status of their own inherit the status of the index
//   (`control-panel/desktop.mdx` -> `beta`); `sub` and others stay.
const paths = Object.keys(pages).sort(
	(a, b) => Number(isIndex(b)) - Number(isIndex(a)) || a.localeCompare(b),
);
for (const path of paths) {
	const name = toName(path);
	const frontmatter = pages[path];
	if (!name || !frontmatter.title) {
		continue;
	}

	const target =
		isIndex(path) && frontmatter.redirectTo ? pathOf(frontmatter.redirectTo) : undefined;
	const isInFamily = /\/components\/[^/]+\/[^/]+\.mdx$/.test(path);
	const inherited = isInFamily && !isIndex(path) ? pages[indexOf(path)]?.status : undefined;
	const merged = {
		...components[name],
		...(target ? fields(pages[target]) : {}),
		...fields(frontmatter),
	};
	components[name] = {
		...fields({ ...merged, status: merged.status ?? inherited }),
		url: toUrl(target ?? path),
	} as Component;
}

export const GET: APIRoute = () =>
	new Response(JSON.stringify(components, null, '\t'), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
