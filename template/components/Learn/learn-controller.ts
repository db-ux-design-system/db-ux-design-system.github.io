/**
 * Progressive enhancement for a Learn article. The blocks are rendered server-side by
 * LearnArticle/LearnBlock/LearnAside; this module adds the article/stepper toggle and,
 * in stepper view, shows one block at a time with previous/next.
 *
 * It runs as a bundled module script (not a React island, which does not hydrate
 * reliably inside MDX). The view preference lives in localStorage; the current view and
 * step live in the query string so links and browser Back/Forward work. Wired on
 * astro:page-load so it also runs after a ClientRouter navigation.
 */

const STORAGE_KEY = 'db-ux-learn-view';

/**
 * Dispatched on window when the reader moves to another step with Back or Next.
 * Detail: `{ index, total }`, index starting at 0.
 */
export const LEARN_STEP_EVENT = 'db-ux-learn-step';

/**
 * Smallest height of the step content, about three lines of text. Only on very low
 * screens, where even this does not fit, the page itself scrolls instead.
 */
const MIN_STEP_HEIGHT = 80;

type View = 'article' | 'stepper';

type Step = {
	title: string;
	/**
	 * The block section of this step. Additional-info asides live inside it. The intro
	 * step has none: it is the page hero, which stays where it is.
	 */
	element?: HTMLElement;
};

/** The heading that opens a block: the first `## …` of the block. */
function headingOf(block: HTMLElement): HTMLElement | null {
	return block.querySelector<HTMLElement>('h2');
}

/** The page headline in the hero; it opens the intro step. */
function heroHeadline(): HTMLElement | null {
	return document.querySelector<HTMLElement>('.page-hero-headline');
}

/**
 * Turns the links in the core text of a block into teaser cards, shown below the text
 * in the stepper view. Core text means the paragraphs and lists directly in the block,
 * not the additional info and not existing teaser cards. The card title is the link
 * text; an optional description comes from the Markdown link title,
 * e.g. `[Migration](/path "Switch from DB UI step by step")`.
 *
 * The inline link stays in the text for the article view. In the stepper it is marked
 * so CSS shows it as plain text, and it leaves the tab order, so each target is reached
 * once, through its card.
 */
function buildLinkCards(block: HTMLElement) {
	if (block.querySelector(':scope > .learn-link-cards')) return;
	const links = Array.from(
		block.querySelectorAll<HTMLAnchorElement>(':scope > :is(p, ul, ol) a[href]'),
	);
	if (links.length === 0) return;

	const grid = document.createElement('div');
	grid.className = `teaser-cards teaser-cards-cols-${Math.min(links.length, 2)} learn-link-cards`;

	for (const link of links) {
		const url = new URL(link.href, window.location.href);
		const external = url.protocol.startsWith('http') && url.origin !== window.location.origin;
		const label = link.textContent?.trim() ?? '';

		const card = document.createElement('a');
		card.href = link.href;
		card.className = 'teaser-card-link';
		if (external) {
			card.target = '_blank';
			card.rel = 'noreferrer';
		}

		const surface = document.createElement('div');
		surface.className = 'db-card';
		surface.dataset.behavior = 'interactive';
		surface.dataset.spacing = 'small';

		const content = document.createElement('div');
		content.className = 'teaser-content';
		const title = document.createElement('h3');
		title.className = 'teaser-title';
		// Link texts often start lowercase in running text ("start with the migration"),
		// so a phrase gets a capital first letter. Single tokens such as an e-mail
		// address or a URL stay as written.
		title.textContent = /\s/.test(label) ? label.charAt(0).toUpperCase() + label.slice(1) : label;
		content.append(title);
		if (link.title) {
			const description = document.createElement('p');
			description.className = 'teaser-description';
			description.textContent = link.title;
			content.append(description);
		}
		surface.append(content);
		card.append(surface);

		if (external) {
			const hint = document.createElement('span');
			hint.dataset.visuallyHidden = 'true';
			hint.textContent =
				document.documentElement.lang === 'de' ? '(öffnet in neuem Tab)' : '(opens in new tab)';
			card.append(hint);
		}
		grid.append(card);
		link.dataset.learnInlineLink = '';
	}

	// After the core text, before the additional info.
	const aside = block.querySelector(':scope > [data-learn-aside]');
	block.insertBefore(grid, aside);
}

/** The "Show more" button of an additional-info area. */
function toggleOf(aside: HTMLElement): HTMLButtonElement {
	return aside.querySelector<HTMLButtonElement>('[data-learn-aside-toggle]')!;
}

/** Shows or hides the body of an additional-info area and updates its button. */
function setAside(aside: HTMLElement, expanded: boolean, labels?: { more: string; less: string }) {
	const body = aside.querySelector<HTMLElement>('[data-learn-aside-body]')!;
	const button = toggleOf(aside);
	body.hidden = !expanded;
	button.setAttribute('aria-expanded', String(expanded));
	button.dataset.icon = expanded ? 'minus' : 'plus';
	if (labels) button.textContent = expanded ? labels.less : labels.more;
}

/**
 * Builds the steps from the rendered article; nothing is authored twice. The first step
 * is the page hero (headline and description), then one step per block. Additional
 * info lives inside its block, so a block is the whole step.
 */
function readSteps(root: HTMLElement): Step[] {
	const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-learn-block]')).map(
		(block) => ({ title: headingOf(block)?.textContent?.trim() ?? '', element: block }),
	);
	const headline = heroHeadline();
	return headline ? [{ title: headline.textContent?.trim() ?? '' }, ...blocks] : blocks;
}

function setup(root: HTMLElement): boolean {
	// Already wired (e.g. astro:page-load fired after the first setup): keep the page
	// flag in sync with the current view and do not attach the listeners twice.
	if (root.dataset.learnReady === 'true') {
		document.documentElement.dataset.learnView = root.dataset.learnView;
		return true;
	}

	const controls = document.querySelector<HTMLElement>('[data-learn-controls]');
	const nav = document.querySelector<HTMLElement>('[data-stepper-nav]');
	const steps = readSteps(root);
	// On the first load the client:only Shell mounts the content in stages, so the
	// controls, the nav or the blocks may not all be present yet. Report "not ready"
	// so the caller keeps observing and retries, instead of giving up until a reload.
	if (!controls || !nav || steps.length === 0) return false;

	const toggle = controls.querySelector<HTMLElement>('.learn-view-toggle');

	// Move the view toggle into the page toolbar in the hero, so it shares one action
	// bar with the reading list button. It goes first, so the icon button stays at the
	// far end. The toolbar is rendered by the hero and may appear a tick later than the
	// content; if it is not there yet, wait and retry.
	const toolbar = document.querySelector<HTMLElement>('[data-page-toolbar]');
	if (toggle && !toolbar) return false;
	if (toggle && toolbar && toggle.parentElement !== toolbar) {
		toolbar.prepend(toggle);
	}

	root.dataset.learnReady = 'true';
	for (const step of steps) if (step.element) buildLinkCards(step.element);
	// The controls wrapper only held the toggle, which now lives in the toolbar; keep
	// it hidden so it leaves no empty space in the content flow.
	controls.hidden = true;

	const scope = toolbar ?? controls;
	const articleBtn = scope.querySelector<HTMLButtonElement>('[data-view-btn="article"]')!;
	const stepperBtn = scope.querySelector<HTMLButtonElement>('[data-view-btn="stepper"]')!;
	const prevBtn = nav.querySelector<HTMLButtonElement>('[data-step-prev]')!;
	const nextBtn = nav.querySelector<HTMLButtonElement>('[data-step-next]')!;
	const statusEl = nav.querySelector<HTMLElement>('[data-step-status]')!;
	const progressFill = nav.querySelector<HTMLElement>('[data-progress-fill]')!;
	const template = root.dataset.stepTemplate ?? 'Step {current} of {total}';
	const shell = root.closest<HTMLElement>('.db-shell-content');

	const total = steps.length;
	let view: View = 'article';
	let stepIndex = 0;

	const readInitial = () => {
		const params = new URLSearchParams(window.location.search);
		const urlView = params.get('view');
		if (urlView === 'stepper' || urlView === 'article') {
			view = urlView;
		} else {
			view = window.localStorage.getItem(STORAGE_KEY) === 'stepper' ? 'stepper' : 'article';
		}
		const rawStep = Number(params.get('step'));
		stepIndex = Number.isFinite(rawStep) && rawStep > 0 ? Math.min(rawStep - 1, total - 1) : 0;
	};

	const writeUrl = () => {
		const params = new URLSearchParams(window.location.search);
		if (view === 'stepper') {
			params.set('view', 'stepper');
			params.set('step', String(stepIndex + 1));
		} else {
			params.delete('view');
			params.delete('step');
		}
		const query = params.toString();
		window.history.replaceState(
			window.history.state,
			'',
			`${window.location.pathname}${query ? `?${query}` : ''}`,
		);
	};

	/**
	 * Stepper view: the step content always fills exactly the space between the hero and
	 * the navigation bar, so the bar sits right above the footer on every step and never
	 * jumps, and the footer stays visible. A taller step scrolls inside its area.
	 *
	 * The free space is measured, not calculated: the step area is made far too tall for
	 * a moment, then the shell content (the scroll container of the page) reports by how
	 * much it overflows. That amount comes off again, which leaves the exact height.
	 */
	const PROBE_HEIGHT = 100_000;
	const fit = () => {
		root.style.blockSize = '';
		root.removeAttribute('tabindex');
		root.removeAttribute('role');
		root.removeAttribute('aria-label');
		if (view !== 'stepper' || !shell) return;

		const scrollTop = shell.scrollTop;
		root.style.blockSize = `${PROBE_HEIGHT}px`;
		const excess = shell.scrollHeight - shell.clientHeight;
		root.style.blockSize = `${Math.max(MIN_STEP_HEIGHT, Math.floor(PROBE_HEIGHT - excess))}px`;
		shell.scrollTop = scrollTop;

		// A scrollable region has to be reachable with the keyboard and needs a name.
		if (root.scrollHeight > root.clientHeight) {
			root.tabIndex = 0;
			root.setAttribute('role', 'region');
			root.setAttribute('aria-label', steps[stepIndex]?.title ?? '');
		}
	};

	const render = (focusHeading = false) => {
		root.dataset.learnView = view;
		// Inline links of the core text: a tab stop in the article view only. In the
		// stepper their teaser cards below the text are the tab stops.
		for (const link of root.querySelectorAll<HTMLElement>('[data-learn-inline-link]')) {
			if (view === 'stepper') link.tabIndex = -1;
			else link.removeAttribute('tabindex');
		}
		// Page-level flag, e.g. to hide the table of contents in stepper view.
		document.documentElement.dataset.learnView = view;
		articleBtn.setAttribute('aria-pressed', String(view === 'article'));
		stepperBtn.setAttribute('aria-pressed', String(view === 'stepper'));
		nav.hidden = view !== 'stepper';

		if (view === 'article') {
			delete document.documentElement.dataset.learnIntro;
			for (const step of steps) if (step.element) step.element.hidden = false;
			// Additional info is shown as plain content, the "Show more" button is hidden.
			for (const aside of root.querySelectorAll<HTMLElement>('[data-learn-aside]')) {
				setAside(aside, true);
				toggleOf(aside).hidden = true;
			}
			fit();
			return;
		}

		steps.forEach((step, index) => {
			if (step.element) step.element.hidden = index !== stepIndex;
		});
		// The intro step shows the hero headline and description; CSS hides them on every
		// other step.
		const intro = !steps[stepIndex].element;
		if (intro) document.documentElement.dataset.learnIntro = 'true';
		else delete document.documentElement.dataset.learnIntro;
		// Stepper: additional info starts collapsed behind a "Show more" button.
		for (const aside of root.querySelectorAll<HTMLElement>('[data-learn-aside]')) {
			toggleOf(aside).hidden = false;
			setAside(aside, false);
		}

		const label = template
			.replace('{current}', String(stepIndex + 1))
			.replace('{total}', String(total));
		statusEl.textContent = label;
		progressFill.style.inlineSize = `${Math.round(((stepIndex + 1) / total) * 100)}%`;
		prevBtn.disabled = stepIndex === 0;
		nextBtn.disabled = stepIndex >= total - 1;

		// Each step starts at its top, inside the step and on the page.
		root.scrollTop = 0;
		if (shell) shell.scrollTop = 0;
		fit();

		// Move focus to the heading of the current block so the step is announced.
		if (focusHeading) {
			const element = steps[stepIndex].element;
			const heading = element ? headingOf(element) : heroHeadline();
			if (heading) {
				heading.tabIndex = -1;
				heading.focus({ preventScroll: true });
			}
		}
	};

	const setView = (next: View) => {
		view = next;
		window.localStorage.setItem(STORAGE_KEY, next);
		writeUrl();
		render(next === 'stepper');
	};

	const goTo = (index: number) => {
		stepIndex = Math.max(0, Math.min(index, total - 1));
		writeUrl();
		render(true);
		// Only clicks report the step, not the initial render from the URL: the reading
		// list asks whether the page is finished when the reader clicks to the last step.
		window.dispatchEvent(
			new CustomEvent(LEARN_STEP_EVENT, { detail: { index: stepIndex, total } }),
		);
	};

	articleBtn.addEventListener('click', () => setView('article'));
	stepperBtn.addEventListener('click', () => setView('stepper'));
	prevBtn.addEventListener('click', () => goTo(stepIndex - 1));
	nextBtn.addEventListener('click', () => goTo(stepIndex + 1));

	// "Show more" / "Show less" per additional-info area (stepper view only).
	for (const aside of root.querySelectorAll<HTMLElement>('[data-learn-aside]')) {
		const button = toggleOf(aside);
		const labels = {
			more: button.dataset.labelMore ?? 'Show more',
			less: button.dataset.labelLess ?? 'Show less',
		};
		button.addEventListener('click', () => {
			setAside(aside, button.getAttribute('aria-expanded') !== 'true', labels);
			fit();
		});
	}

	// Refit when the available space or the step height changes: window size, the hero
	// settling after fonts and the toolbar island load, the footer, an additional-info
	// accordion opening or closing, late images. The step content itself is not
	// observed, because fit changes its height.
	const resizeObserver = new ResizeObserver(() => fit());
	for (const el of [
		shell,
		document.querySelector('.page-hero'),
		nav,
		shell?.querySelector('footer'),
	]) {
		if (el) resizeObserver.observe(el);
	}
	root.addEventListener('toggle', () => fit(), true);
	root.addEventListener('load', () => fit(), true);

	readInitial();
	render(false);
	return true;
}

/** How long to wait for the Shell to mount the content before giving up. */
const MOUNT_TIMEOUT = 30_000;

export function initLearnArticle() {
	// The article lives inside the client:only React Shell. It mounts after this script
	// runs on the first load, and again after every ClientRouter navigation, in both
	// cases after astro:page-load has fired. So every page start begins a fresh wait:
	// try once, then observe the DOM until the content is wired up.
	let observer: MutationObserver | undefined;
	let timeout: number | undefined;

	const stop = () => {
		observer?.disconnect();
		observer = undefined;
		window.clearTimeout(timeout);
	};

	const run = () => {
		const root = document.getElementById('learn-article');
		// setup returns true only once the content, controls, nav and toolbar are all
		// present and wired. Until then the observer keeps retrying.
		if (root && setup(root)) {
			stop();
			return true;
		}
		return false;
	};

	const start = () => {
		stop();
		// A new page: drop the page-level flags of a previous Learn article. setup sets
		// them again if this page is a Learn article.
		delete document.documentElement.dataset.learnView;
		delete document.documentElement.dataset.learnIntro;
		if (run()) return;
		observer = new MutationObserver(() => run());
		observer.observe(document.body, { childList: true, subtree: true });
		// Pages without a Learn article never match; stop observing them eventually.
		timeout = window.setTimeout(stop, MOUNT_TIMEOUT);
	};

	start();
	// After a client-side navigation the old observer would watch a page that is gone.
	document.addEventListener('astro:before-swap', stop);
	document.addEventListener('astro:page-load', start);
}
