export const appConfig: AppConfig = {
	title: 'Design System',
	hostname: 'https://design-system.deutschebahn.com',
	basePath: '/',
	// The Theme Builder preview pages carry robots: noindex and must not appear in the
	// sitemap either, so DB Search does not pick them up.
	sitemapBlacklist: ['themebuilder/preview', 'de/themebuilder/preview'],
	language: 'en',
	titleSuffix: 'DB UX Design System',
};
