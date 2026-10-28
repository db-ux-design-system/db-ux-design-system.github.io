import { toEnSlug } from '@template/i18n/slug-mapping';

/**
 * Ids of all Markdown pages: the EN path below content/pages without extension and
 * index, e.g. `documentation/learn/about`. DE pages are translated to their EN id with
 * toEnSlug, so a page that exists in DE only is included as well.
 *
 * Same globs and query as the navigation (content-navigation.ts): only the frontmatter
 * is read, and the Shell bundles these modules already.
 */
const en = import.meta.glob(
	[
		'../../content/pages/**/*.{md,mdx}',
		'!**/_*/**',
		'!**/demo-b2b/**',
		'!**/demo-b2c/**',
		'!**/de/**',
	],
	{ eager: true, query: '?raw&page-frontmatter', import: 'default' },
);
const de = import.meta.glob(['../../content/pages/de/**/*.{md,mdx}', '!**/_*/**'], {
	eager: true,
	query: '?raw&page-frontmatter',
	import: 'default',
});

const toRel = (key: string, prefix: RegExp) =>
	key
		.replace(/\\/g, '/')
		.replace(prefix, '')
		.replace(/(?:\/index\.(md|mdx)|^index\.(md|mdx))$/, '')
		.replace(/\.(md|mdx)$/, '');

export const pageIds: ReadonlySet<string> = new Set([
	...Object.keys(en).map((key) => toRel(key, /^.*content\/pages\//)),
	...Object.keys(de).map((key) => toEnSlug(toRel(key, /^.*content\/pages\/de\//))),
]);
