export const appConfig: AppConfig = {
	title: 'Design System',
	hostname: 'https://design-system.deutschebahn.com',
	basePath: '/',
	// The Theme Builder preview pages carry robots: noindex and must not appear in the
	// sitemap either, so DB Search does not pick them up.
	sitemapBlacklist: ['theme-builder/preview', 'de/theme-builder/preview'],
	language: 'en',
	titleSuffix: 'DB UX Design System',
};
