import { appConfig } from '@root/app.config';

/** The configured base path without trailing slash; empty for the site root. */
const base = (appConfig.basePath || '/').replace(/\/+$/, '');

/**
 * Prefixes a site path (starting with /) with the configured base path, like the
 * astro `base` option does for the generated pages. With basePath `/` the path stays.
 */
export const withBasePath = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

/** Removes the configured base path from a URL path, e.g. Astro.url.pathname. */
export const stripBasePath = (pathname: string) =>
	base && (pathname === base || pathname.startsWith(`${base}/`))
		? pathname.slice(base.length) || '/'
		: pathname;
