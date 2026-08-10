/**
 * Bidirectional slug mapping between EN and DE URL paths.
 *
 * Maps individual path segments (not full paths) so that composed paths
 * like "products-and-services/components" can be translated segment by segment.
 */

const segmentMap: Record<string, string> = {
	// Top-level
	'products-and-services': 'produkte-und-services',
	'about-us': 'ueber-uns',
	'legal': 'rechtliches',
	'documentation': 'dokumentation',

	// products-and-services children
	'components': 'komponenten',
	'extensions': 'erweiterungen',
	'for-designer': 'fuer-designerinnen',
	'for-developer': 'fuer-entwicklerinnen',
	'for-productmanagement': 'fuer-produktmanagement',

	// legal children
	'imprint': 'impressum',
	'privacy': 'datenschutz',

	// documentation children
	'get-started': 'erste-schritte',
	'learn': 'lernen',
	'contribution': 'mitwirken',
	'resources': 'ressourcen',
	'versioning': 'versionierung',
	// Note: 'patterns' is identical in both languages under products-and-services,
	// so no segment entry is needed. Only 'documentation/patterns' still differs
	// (DE uses the singular folder) and is handled via fullPathMap below.

	// foundation children
	'colors': 'farben',
	'typography': 'typografie',
	'spacing': 'abstaende',
	'opacity': 'transparenz',
	'elevation': 'schattierung',
	'sizing': 'groessen',
	'border-radius': 'eckenradius',
	'border-width': 'strichstaerke',
};

// Full-path overrides for cases where segment-level mapping causes collisions
const fullPathMap: Record<string, string> = {
	'documentation/patterns': 'dokumentation/pattern',
};

// Reverse full-path map (DE → EN)
const reverseFullPathMap: Record<string, string> = Object.fromEntries(
	Object.entries(fullPathMap).map(([en, de]) => [de, en]),
);

// Reverse segment map (DE → EN)
const reverseSegmentMap: Record<string, string> = Object.fromEntries(
	Object.entries(segmentMap).map(([en, de]) => [de, en]),
);

/**
 * Converts an EN path to its DE equivalent.
 * Translates each segment individually.
 *
 * @example toDeSlug('products-and-services/components') → 'produkte-und-services/komponenten'
 */
export function toDeSlug(enPath: string): string {
	const normalized = enPath.replace(/^\//, '').replace(/\/$/, '');
	if (!normalized) return '';

	// Check full-path overrides first
	if (fullPathMap[normalized]) return fullPathMap[normalized];
	// Check if the path starts with a full-path override key
	for (const [enFull, deFull] of Object.entries(fullPathMap)) {
		if (normalized.startsWith(enFull + '/')) {
			return deFull + '/' + normalized.slice(enFull.length + 1);
		}
	}

	return normalized
		.split('/')
		.map((segment) => segmentMap[segment] ?? segment)
		.join('/');
}

/**
 * Converts a DE path to its EN equivalent.
 * Translates each segment individually.
 *
 * @example toEnSlug('produkte-und-services/komponenten') → 'products-and-services/components'
 */
export function toEnSlug(dePath: string): string {
	const normalized = dePath.replace(/^\//, '').replace(/\/$/, '');
	if (!normalized) return '';

	// Check full-path overrides first
	if (reverseFullPathMap[normalized]) return reverseFullPathMap[normalized];
	// Check if the path starts with a reverse full-path override key
	for (const [deFull, enFull] of Object.entries(reverseFullPathMap)) {
		if (normalized.startsWith(deFull + '/')) {
			return enFull + '/' + normalized.slice(deFull.length + 1);
		}
	}

	return normalized
		.split('/')
		.map((segment) => reverseSegmentMap[segment] ?? segment)
		.join('/');
}

/**
 * Given the current full pathname, returns the corresponding path in the other language.
 *
 * @example getLocalizedPath('/products-and-services/components', 'de') → '/de/produkte-und-services/komponenten'
 * @example getLocalizedPath('/de/produkte-und-services/komponenten', 'en') → '/products-and-services/components'
 */
export function getLocalizedPath(pathname: string, targetLocale: 'en' | 'de'): string {
	// Strip existing /de/ prefix to get the locale-neutral path
	const isCurrentlyDe = /^\/de(\/|$)/.test(pathname);
	const neutralPath = isCurrentlyDe
		? pathname.replace(/^\/de\/?/, '')
		: pathname.replace(/^\//, '').replace(/\/$/, '');

	if (targetLocale === 'de') {
		// Translate EN segments → DE, add /de/ prefix
		const enPath = isCurrentlyDe ? toEnSlug(neutralPath) : neutralPath;
		const translated = toDeSlug(enPath);
		return `/de/${translated}`;
	}

	// Translate DE segments → EN
	const translated = isCurrentlyDe ? toEnSlug(neutralPath) : neutralPath;
	return `/${translated}` || '/';
}
