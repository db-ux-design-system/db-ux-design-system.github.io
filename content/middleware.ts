import { defineMiddleware } from 'astro:middleware';
import { toEnSlug } from '@template/i18n/slug-mapping';

/**
 * i18n fallback middleware.
 *
 * When a /de/... page doesn't exist (404), rewrites to the EN version
 * by translating the DE slug back to EN.
 * The user stays on the /de/ URL and sees the English content as fallback.
 *
 * In production (static build), fallback is handled by the catch-all route
 * at content/pages/de/[...slug].astro which generates redirect pages.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	if (response.status === 404 && context.url.pathname.startsWith('/de/')) {
		const dePath = context.url.pathname.replace(/^\/de\//, '');
		const enPath = '/' + toEnSlug(dePath);
		return context.rewrite(enPath);
	}

	return response;
});
