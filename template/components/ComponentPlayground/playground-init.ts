import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ComponentPlayground from './ComponentPlayground.tsx';

const mountedRoots = new WeakSet<Element>();

function mountPlaygrounds() {
	document.querySelectorAll<HTMLElement>('[data-playground-config]').forEach((el) => {
		if (mountedRoots.has(el)) return;
		mountedRoots.add(el);

		const configStr = el.getAttribute('data-playground-config');
		if (!configStr) return;

		try {
			const config = JSON.parse(configStr);
			const root = createRoot(el);
			root.render(createElement(ComponentPlayground, { config }));
		} catch (e) {
			console.error('Playground mount error:', e);
		}
	});
}

// MutationObserver to catch when Shell renders content into DOM
const observer = new MutationObserver(() => {
	mountPlaygrounds();
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true,
});

// Try immediately
mountPlaygrounds();

// Re-mount after Astro page transitions
document.addEventListener('astro:page-load', mountPlaygrounds);
