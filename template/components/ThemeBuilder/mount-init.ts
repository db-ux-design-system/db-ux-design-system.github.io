import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeBuilder from './ThemeBuilder.tsx';
import type { ThemeBuilderLang } from './messages.ts';
import { waitForElements } from '@template/utils/client.utils.ts';

/**
 * Mounts the Theme Builder into its placeholder.
 *
 * The page content is slot content of the client-only shell. An Astro island nested
 * in it never hydrates, and a script inside it never runs. The page therefore renders
 * an empty element and loads this module from a script in the page itself – the
 * same approach as playground-init and the Component Overview.
 */
const MOUNT_SELECTOR = '[data-theme-builder-mount]';
const mounted = new WeakSet<Element>();
// Track the created roots so they can be unmounted when the ClientRouter swaps the document.
const roots = new Map<Element, ReturnType<typeof createRoot>>();

function mountThemeBuilder(): boolean {
	const elements = document.querySelectorAll<HTMLElement>(MOUNT_SELECTOR);
	// The mount target does not exist on this page. Keep waiting until it (or a page swap)
	// appears; the stop signal is the target itself, not a sibling marker.
	if (elements.length === 0) {
		return false;
	}
	elements.forEach((element) => {
		if (mounted.has(element)) return;
		mounted.add(element);
		const lang: ThemeBuilderLang = element.dataset['lang'] === 'de' ? 'de' : 'en';
		const root = createRoot(element);
		roots.set(element, root);
		root.render(createElement(ThemeBuilder, { lang }));
	});
	return true;
}

/** Unmounts every root before the document is swapped, so the builder's effect cleanup runs
 *  (its window resize handler would otherwise leak one handler per visit). */
function unmountThemeBuilder(): void {
	for (const [element, root] of roots) {
		root.unmount();
		mounted.delete(element);
	}
	roots.clear();
}

if (!mountThemeBuilder()) {
	waitForElements(mountThemeBuilder);
}
document.addEventListener('astro:before-swap', unmountThemeBuilder);
document.addEventListener('astro:page-load', () => {
	if (!mountThemeBuilder()) {
		waitForElements(mountThemeBuilder);
	}
});
