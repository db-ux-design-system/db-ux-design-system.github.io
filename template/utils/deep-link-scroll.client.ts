/**
 * Scrolls documentation fragment links after the client-only Shell and its
 * content have reached a stable layout.
 *
 * The Shell renders with `client:only="react"`, so anchor targets do not exist
 * yet when the browser performs its native hash scroll. This handler waits for
 * the target to appear and for the surrounding layout to stop shifting.
 */

/** Upper bound for the whole attempt, so a missing target cannot loop forever. */
const SCROLL_DEADLINE_MS = 10000;
/** Fonts change heading metrics, but must never block the scroll indefinitely. */
const FONT_WAIT_MS = 1000;
/** Consecutive frames with an unchanged target position before scrolling. */
const REQUIRED_STABLE_FRAMES = 3;
/** Quiet period after the last resize before the layout counts as settled. */
const RESIZE_QUIET_MS = 250;
/** Sub-pixel tolerance when comparing the target position between frames. */
const POSITION_EPSILON = 0.5;
/** Containers that resize independently while the Shell hydrates. */
const LAYOUT_CONTAINERS = ['.db-shell-content', '.dba-main-content'];

let scrollRun = 0;

function scrollToHash() {
	const run = ++scrollRun;
	if (!window.location.hash) return;

	const id = decodeURIComponent(window.location.hash.slice(1));
	const deadline = performance.now() + SCROLL_DEADLINE_MS;
	let previousTop = Number.NaN;
	let stableFrames = 0;
	let lastResize = performance.now();

	const resizeObserver =
		typeof ResizeObserver === 'undefined'
			? undefined
			: new ResizeObserver(function () {
					stableFrames = 0;
					lastResize = performance.now();
				});
	const observedContainers = new Set<Element>();

	/**
	 * Observes layout containers as soon as they exist, independently of the
	 * target lookup, so shifts before the target appears still count.
	 */
	function observeLayoutContainers() {
		if (!resizeObserver) return;
		for (const selector of LAYOUT_CONTAINERS) {
			const container = document.querySelector(selector);
			if (container && !observedContainers.has(container)) {
				resizeObserver.observe(container);
				observedContainers.add(container);
			}
		}
	}

	function waitForStableLayout() {
		// A newer run (or navigation) took over, so release the observer.
		if (run !== scrollRun) {
			resizeObserver?.disconnect();
			return;
		}

		observeLayoutContainers();

		const target = document.getElementById(id);
		// Scroll the heading rather than an inline alias span, so the heading's
		// own scroll-margin is applied.
		const scrollTarget = target?.closest('h1, h2, h3, h4, h5, h6') ?? target;
		const shellContent = document.querySelector('.db-shell-content');

		if (!scrollTarget || !shellContent) {
			if (performance.now() < deadline) {
				requestAnimationFrame(waitForStableLayout);
				return;
			}
			resizeObserver?.disconnect();
			console.warn(
				`[deep-link-scroll] No element found for fragment "#${id}" within ${SCROLL_DEADLINE_MS} ms. Skipping scroll.`,
			);
			return;
		}

		const top = scrollTarget.getBoundingClientRect().top;
		stableFrames = Math.abs(top - previousTop) < POSITION_EPSILON ? stableFrames + 1 : 0;
		previousTop = top;

		const isStable =
			stableFrames >= REQUIRED_STABLE_FRAMES && performance.now() - lastResize >= RESIZE_QUIET_MS;
		if (!isStable && performance.now() < deadline) {
			requestAnimationFrame(waitForStableLayout);
			return;
		}

		resizeObserver?.disconnect();
		scrollTarget.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
	}

	function startScrolling() {
		requestAnimationFrame(waitForStableLayout);
	}

	const fontTimeout = new Promise<void>(function (resolve) {
		setTimeout(resolve, FONT_WAIT_MS);
	});

	if (document.fonts) {
		Promise.race([document.fonts.ready, fontTimeout]).then(startScrolling, startScrolling);
	} else {
		startScrolling();
	}
}

document.addEventListener('astro:page-load', scrollToHash);
window.addEventListener('hashchange', scrollToHash);
scrollToHash();
