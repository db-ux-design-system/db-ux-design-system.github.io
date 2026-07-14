import { defineMiddleware } from 'astro:middleware';

/**
 * Middleware that handles i18n fallback in dev mode.
 * When a /de/... page doesn't exist, redirects to the EN version.
 * In production builds, Astro's built-in fallback config handles this.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	// Only intercept 404s on /de/ routes
	if (response.status === 404 && context.url.pathname.startsWith('/de/')) {
		const enPath = context.url.pathname.replace(/^\/de/, '') || '/';
		return context.redirect(enPath, 302);
	}

	return response;
});
