import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import FrameworkTabs from './FrameworkTabs';
import { waitForElements } from '@template/utils/client.utils.ts';

/*
 * Mounts the framework tabs of the Code section.
 *
 * Mounted manually (same pattern as the Component Playground) instead of as a
 * `client:load` island: the documentation content sits inside the client-only
 * Shell, and a hydrated island in there makes Astro emit its island runtime
 * inside the Shell's slot template. The Shell then never hydrates and the page
 * stays empty.
 *
 * Until the script runs, the root shows all frameworks one below the other
 * (rendered by ComponentCode.astro), so the content is available without JS.
 */

const mountedRoots = new WeakSet<Element>();

function mountFrameworkTabs() {
	document.querySelectorAll<HTMLElement>('[data-framework-tabs]').forEach((element) => {
		if (mountedRoots.has(element)) return;
		mountedRoots.add(element);

		const props = JSON.parse(element.dataset.frameworkTabs ?? '{}');
		createRoot(element).render(createElement(FrameworkTabs, props));
	});

	return false;
}

mountFrameworkTabs();
document.addEventListener('astro:page-load', () => {
	waitForElements(mountFrameworkTabs);
});
