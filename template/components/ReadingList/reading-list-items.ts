import {
	type Lang,
	type PackagePage,
	packagePages,
	toHref,
} from '@template/components/GetStartedWizard/wizard-flow';
import { toDeSlug, toEnSlug } from '@template/i18n/slug-mapping';
import type { ReadingListItem } from './reading-list-store';

/** Id of a wizard page on the reading list: EN path without leading slash, plus # and EN anchor. */
export const toReadingListId = (page: PackagePage) =>
	`${page.path.replace(/^\//, '')}${page.anchor ? `#${page.anchor.en}` : ''}`;

const catalog = new Map(Object.values(packagePages).map((page) => [toReadingListId(page), page]));

/**
 * Id of the page at the given URL path: the EN path without leading and trailing
 * slash. DE paths are translated with toEnSlug.
 */
export const pageId = (pathname: string) => {
	const path = pathname.replace(/^\/+|\/+$/g, '');
	return path === 'de' || path.startsWith('de/') ? toEnSlug(path.replace(/^de\/?/, '')) : path;
};

export type ResolvedItem = {
	id: string;
	label: string;
	href: string;
	source: 'bookmark' | 'wizard';
};

/**
 * Label and link of each item in the given language. Wizard pages use the catalog,
 * so their labels and anchors are localized. Bookmarked pages use the stored titles;
 * a page without a version in this language links to the other one. Items without
 * any label are skipped.
 */
export function resolveItems(items: ReadingListItem[], lang: Lang): ResolvedItem[] {
	const resolved: ResolvedItem[] = [];
	for (const item of items) {
		const source = item.source ?? (item.title ? 'bookmark' : 'wizard');
		const page = catalog.get(item.id);
		if (page) {
			resolved.push({ id: item.id, label: page.label[lang], href: toHref(page, lang), source });
			continue;
		}
		const other: Lang = lang === 'de' ? 'en' : 'de';
		const linkLang = item.title?.[lang] ? lang : item.title?.[other] ? other : undefined;
		if (!linkLang) continue;
		resolved.push({
			id: item.id,
			label: item.title![linkLang]!,
			href: linkLang === 'de' ? `/de/${toDeSlug(item.id)}` : `/${item.id}`,
			source,
		});
	}
	return resolved;
}
