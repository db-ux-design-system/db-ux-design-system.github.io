import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { OverviewMount, type MountedComponent } from './_ComponentOverview.tsx';
import { waitForElements } from '@template/utils/client.utils.ts';
import type { Language } from '@template/context/language-context';

/**
 * Mounts the specimens on the Component Overview page that need JavaScript.
 *
 * Most specimens render completely without it and stay static. A specimen is
 * mounted when the component would otherwise have no accessible name, show a
 * wrong state, or open only through a trigger: dialog, drawer and popover need
 * the trigger, the custom select and the input link their label to the control
 * through an id they only assign once they run, and the tooltip in the button
 * block places itself from
 * script — left to the stylesheet it hangs below the page and makes the document
 * scrollable. The loading indicator seeds its state in an effect and would stay
 * at `inactive`, and the pagination writes the current page onto its markup from
 * script and shows none without it. The native select links its label to the
 * control through an id it only assigns once it runs, the same as the input, and
 * the tabs build their selection — the active tab's `aria-selected`, the
 * tab-to-panel links, the roving tabindex and the hiding of inactive panels — in
 * an effect, so without it every panel shows at once and no tab is selected. The
 * checkbox and switch only write `invalidMessage` into the DOM once native form
 * validation has run through an effect, the same gap as input and select, so
 * their invalid specimens would show the critical infotext empty but present —
 * a stray icon with no text — without mounting. The textarea has the same
 * `invalidMessage` gap. The tooltip opens through its trigger and places its
 * panel from script, the same as the popover.
 *
 * An Astro client directive cannot provide that here: the page content is slot
 * content of the client-only shell, and an island nested in it leaves the shell
 * waiting for its children, which keeps the whole page blank. So the page renders
 * an empty element per specimen and a React root is mounted into it from here —
 * the same approach playground-init takes.
 *
 * Loaded from a `<script>` in the page itself rather than from the layout. Astro
 * hoists a processed script out of the client-only slot into the page bundle, so
 * it executes even though the surrounding markup is slot content. That keeps the
 * module on this page instead of on every documentation page.
 *
 * Mounting into the page rather than rendering next to it also keeps the version
 * preview working: dialog and drawer render their overlay in place, so they stay
 * inside .dba-main-content and inherit the border radius tokens that preview
 * redefines.
 */
const MOUNT_SELECTOR = '[data-overview-mount]';

const MOUNTED_COMPONENTS: MountedComponent[] = [
	'button',
	'checkbox',
	'custom-select',
	'dialog',
	'drawer',
	'input',
	'loading-indicator',
	'pagination',
	'popover',
	'select',
	'switch',
	'tabs',
	'textarea',
	'tooltip',
];

const mounted = new WeakSet<Element>();

function mountSpecimens(): boolean {
	const elements = document.querySelectorAll<HTMLElement>(MOUNT_SELECTOR);

	if (elements.length === 0) {
		/*
		 * Reported as done once the shell has rendered content without a specimen.
		 * The script is page-scoped, but Astro's client router can keep the module
		 * alive across a navigation, so the watcher must not run on indefinitely
		 * for an element that never arrives.
		 */
		return Boolean(document.querySelector('.dba-main-content'));
	}

	elements.forEach((element) => {
		if (mounted.has(element)) return;

		const component = element.dataset['overviewMount'] as MountedComponent;
		if (!MOUNTED_COMPONENTS.includes(component)) return;

		mounted.add(element);
		createRoot(element).render(
			createElement(OverviewMount, {
				component,
				locale: (element.dataset['overviewLocale'] ?? 'en') as Language,
			}),
		);
	});

	return true;
}

if (!mountSpecimens()) {
	waitForElements(mountSpecimens);
}

document.addEventListener('astro:page-load', () => {
	if (!mountSpecimens()) {
		waitForElements(mountSpecimens);
	}
});
