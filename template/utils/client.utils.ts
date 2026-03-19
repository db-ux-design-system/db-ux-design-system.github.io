import { appConfig } from '@root/app.config';

/**
 * Get the aria-current attribute for the given path.
 * @param path - The path to check against the current URL.
 * @returns The aria-current attribute value if the path matches the current URL, otherwise undefined.
 */
export function getAriaCurrent(path?: string): 'page' | undefined {
	if (typeof window === 'undefined' || !path) return undefined;

	const { basePath } = appConfig;
	const pathname = window.location.pathname.replace(/\/+$/, '');
	const fullPath = `${basePath}${path}`.replace(/\/+$/, '');
	return pathname === fullPath ? 'page' : undefined;
}

/**
 * Waits for elements to be added to the DOM.
 * @param initFn - A function that returns true when the elements are found.
 */
export function waitForElements(initFn: () => boolean) {
	new MutationObserver(function (_, observer) {
		if (initFn()) observer.disconnect();
	}).observe(document.body, { childList: true, subtree: true });
}
