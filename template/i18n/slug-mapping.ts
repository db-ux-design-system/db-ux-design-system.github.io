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

	// products-and-services children
	'components': 'komponenten',
	'extensions': 'erweiterungen',
	'for-designer': 'fuer-designerinnen',
	'for-developer': 'fuer-entwicklerinnen',
	'for-productmanagement': 'fuer-produktmanagement',

	// legal children
	'imprint': 'impressum',
	'privacy': 'datenschutz',
};

// Reverse map (DE → EN)
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
	if (targetLocale === 'de') {
		// EN → DE: add /de/ prefix and translate segments
		const cleanPath = pathname.replace(/^\//, '').replace(/\/$/, '');
		const translated = toDeSlug(cleanPath);
		return `/de/${translated}`;
	}

	// DE → EN: strip /de/ prefix and translate segments back
	const withoutPrefix = pathname.replace(/^\/de\/?/, '');
	const translated = toEnSlug(withoutPrefix);
	return `/${translated}` || '/';
}
