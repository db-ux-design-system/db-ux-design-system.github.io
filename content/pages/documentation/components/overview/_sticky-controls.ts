import { waitForElements } from '@template/utils/client.utils.ts';

/**
 * Reveals the divider below the version switch on the Component Overview page
 * only while that bar is stuck to the top of the content area.
 *
 * The empty element in front of the bar marks where the bar sits in the flow, so
 * the bar is stuck exactly while that element is scrolled out of the content
 * area. No root is passed to the observer: it already clips the element against
 * the scrolling content area on its way to the viewport.
 *
 * Loaded from a `<script>` in the page rather than from the component. Astro
 * hoists a processed script out of the client-only slot into the page bundle, so
 * it executes even though the surrounding markup is slot content — a script
 * written inside the component's own markup would be inserted as markup and
 * never run.
 */
const SENTINEL_SELECTOR = '.overview-controls-sentinel';
const STICKY_CLASS = 'is-sticky';

const connected = new WeakSet<Element>();

function connectStickyControls(): boolean {
	const sentinel = document.querySelector(SENTINEL_SELECTOR);
	const bar = sentinel?.nextElementSibling;

	if (!sentinel || !bar) {
		/*
		 * Reported as done once the shell has rendered the content without a bar.
		 * The script is page-scoped, but Astro's client router can keep the module
		 * alive across a navigation, so the watcher must not run on indefinitely
		 * for an element that never arrives.
		 */
		return Boolean(document.querySelector('.dba-main-content'));
	}

	if (connected.has(sentinel)) {
		return true;
	}

	connected.add(sentinel);

	const observer = new IntersectionObserver(
		([entry]) => {
			bar.classList.toggle(STICKY_CLASS, !entry.isIntersecting);
		},
		{ threshold: 0 },
	);

	observer.observe(sentinel);

	return true;
}

if (!connectStickyControls()) {
	waitForElements(connectStickyControls);
}

document.addEventListener('astro:page-load', () => {
	if (!connectStickyControls()) {
		waitForElements(connectStickyControls);
	}
});
