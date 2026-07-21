/**
 * Generates static paths for the DE catch-all fallback route.
 * Returns DE-translated slugs for all EN pages that don't have a
 * corresponding DE page, along with the original EN slug for redirecting.
 */
import { toDeSlug } from '@template/i18n/slug-mapping';

function stripToSlug(path: string): string {
	return path
		.replace(/\\/g, '/')
		.replace(/^.*\/pages\//, '')
		.replace(/(?:\/index\.(md|mdx|astro)|^index\.(md|mdx|astro))$/, '')
		.replace(/\.(md|mdx|astro)$/, '');
}

function stripDeToSlug(path: string): string {
	return path
		.replace(/\\/g, '/')
		.replace(/^.*\/pages\/de\//, '')
		.replace(/(?:\/index\.(md|mdx|astro)|^index\.(md|mdx|astro))$/, '')
		.replace(/\.(md|mdx|astro)$/, '');
}

export function getI18nFallbackPaths() {
	const enPages = import.meta.glob(
		[
			'../../content/pages/**/*.{md,mdx,astro}',
			'!../../content/pages/de/**',
			'!../../content/pages/demo-*/**',
			'!../../content/pages/_*/**',
			'!../../content/pages/**/api/**',
			'!../../content/pages/**/_*/**',
			'!../../content/pages/**/_*.astro',
		],
		{ eager: true },
	);

	const dePages = import.meta.glob(
		[
			'../../content/pages/de/**/*.{md,mdx,astro}',
			'!../../content/pages/de/[...slug].astro',
			'!../../content/pages/de/**/_*/**',
			'!../../content/pages/de/**/_*.astro',
		],
		{ eager: true },
	);

	// Collect existing DE slugs (already in German)
	const existingDeSlugs = new Set<string>();
	for (const key of Object.keys(dePages)) {
		const slug = stripDeToSlug(key);
		if (slug) existingDeSlugs.add(slug);
	}

	const paths: Array<{ params: { slug: string }; props: { enSlug: string } }> = [];
	for (const key of Object.keys(enPages)) {
		const enSlug = stripToSlug(key);
		if (!enSlug) continue;

		// Translate EN slug to DE slug (what the URL will look like)
		const deSlug = toDeSlug(enSlug);

		// Skip if a dedicated DE page already exists with this slug
		if (existingDeSlugs.has(deSlug)) continue;

		paths.push({ params: { slug: deSlug }, props: { enSlug } });
	}

	return paths;
}
