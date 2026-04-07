import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ComponentPlayground from './ComponentPlayground.tsx';
import { waitForElements } from '@template/utils/client.utils.ts';

const mountedRoots = new WeakSet<Element>();

function mountPlaygrounds() {
	const dataComponents = document.querySelectorAll<HTMLElement>('[data-component]');

	if (dataComponents.length > 0) {
		dataComponents.forEach((el) => {
			if (mountedRoots.has(el)) return;
			mountedRoots.add(el);

			const component = el.getAttribute('data-component');
			if (!component) return;

			const root = createRoot(el);
			root.render(createElement(ComponentPlayground, { component }));
		});
	}

	return false;
}

mountPlaygrounds();
document.addEventListener('astro:page-load', () => {
	waitForElements(mountPlaygrounds);
});
