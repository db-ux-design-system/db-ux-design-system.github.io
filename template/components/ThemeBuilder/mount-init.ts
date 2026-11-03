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

function mountThemeBuilder(): boolean {
	const elements = document.querySelectorAll<HTMLElement>(MOUNT_SELECTOR);
	if (elements.length === 0) {
		return Boolean(document.querySelector('.dba-main-content'));
	}
	elements.forEach((element) => {
		if (mounted.has(element)) return;
		mounted.add(element);
		const lang: ThemeBuilderLang = element.dataset['lang'] === 'de' ? 'de' : 'en';
		createRoot(element).render(createElement(ThemeBuilder, { lang }));
	});
	return true;
}

if (!mountThemeBuilder()) {
	waitForElements(mountThemeBuilder);
}
document.addEventListener('astro:page-load', () => {
	if (!mountThemeBuilder()) {
		waitForElements(mountThemeBuilder);
	}
});
