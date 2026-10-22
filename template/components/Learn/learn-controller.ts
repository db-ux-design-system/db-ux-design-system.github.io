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

type View = 'article' | 'stepper';

type Step = {
	title: string;
	/** The section wrappers that make up this step, in document order. */
	elements: HTMLElement[];
};

/** The DBSection wrapper that owns a block, or the block itself as a fallback. */
function sectionOf(node: HTMLElement): HTMLElement {
	return node.closest<HTMLElement>('.db-section') ?? node;
}

/** Groups the rendered blocks into steps: a main block plus the asides that follow it. */
function readSteps(root: HTMLElement): Step[] {
	const nodes = Array.from(
		root.querySelectorAll<HTMLElement>('[data-learn-block], [data-learn-aside]'),
	);
	const steps: Step[] = [];
	for (const node of nodes) {
		const isBlock = node.hasAttribute('data-learn-block');
		const section = sectionOf(node);
		if (isBlock || steps.length === 0) {
			steps.push({ title: node.dataset.learnTitle ?? '', elements: [section] });
		} else {
			steps[steps.length - 1].elements.push(section);
		}
	}
	return steps;
}

function setup(root: HTMLElement) {
	// Guard against double init on the same element after client navigation.
	if (root.dataset.learnReady === 'true') return;

	const controls = document.querySelector<HTMLElement>('[data-learn-controls]');
	if (!controls) return;

	const steps = readSteps(root);
	if (steps.length === 0) return;

	root.dataset.learnReady = 'true';
	controls.hidden = false;

	// The sticky navigation sits after the content, so it is a sibling of the controls,
	// not a descendant. Find it from the document.
	const nav = document.querySelector<HTMLElement>('[data-stepper-nav]');
	if (!nav) return;

	const articleBtn = controls.querySelector<HTMLButtonElement>('[data-view-btn="article"]')!;
	const stepperBtn = controls.querySelector<HTMLButtonElement>('[data-view-btn="stepper"]')!;
	const prevBtn = nav.querySelector<HTMLButtonElement>('[data-step-prev]')!;
	const nextBtn = nav.querySelector<HTMLButtonElement>('[data-step-next]')!;
	const statusEl = nav.querySelector<HTMLElement>('[data-step-status]')!;
	const progressFill = nav.querySelector<HTMLElement>('[data-progress-fill]')!;
	const template = root.dataset.stepTemplate ?? 'Step {current} of {total}';

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

	const render = (focusHeading = false) => {
		root.dataset.learnView = view;
		// The active toggle is marked with aria-pressed; the pressed look comes from CSS.
		articleBtn.setAttribute('aria-pressed', String(view === 'article'));
		stepperBtn.setAttribute('aria-pressed', String(view === 'stepper'));
		nav.hidden = view !== 'stepper';

		if (view === 'article') {
			for (const step of steps) for (const el of step.elements) el.hidden = false;
			return;
		}

		steps.forEach((step, index) => {
			const show = index === stepIndex;
			for (const el of step.elements) el.hidden = !show;
		});

		const current = steps[stepIndex];
		const label = template.replace('{current}', String(stepIndex + 1)).replace('{total}', String(total));
		statusEl.textContent = label;
		progressFill.style.inlineSize = `${Math.round(((stepIndex + 1) / total) * 100)}%`;
		prevBtn.disabled = stepIndex === 0;
		nextBtn.disabled = stepIndex >= total - 1;
		// Move focus to the heading of the current block so the step is announced.
		if (focusHeading) {
			const heading = current?.elements[0]?.querySelector<HTMLElement>('.learn-block-title');
			heading?.focus();
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
	};

	articleBtn.addEventListener('click', () => setView('article'));
	stepperBtn.addEventListener('click', () => setView('stepper'));
	prevBtn.addEventListener('click', () => goTo(stepIndex - 1));
	nextBtn.addEventListener('click', () => goTo(stepIndex + 1));

	readInitial();
	render(false);
}

export function initLearnArticle() {
	// The article lives inside the client:only React Shell, which mounts after this
	// script runs. Try now, on astro:page-load, and via a short-lived observer so the
	// controller wires up as soon as the content appears, without polling forever.
	let observer: MutationObserver | undefined;

	const run = () => {
		const root = document.getElementById('learn-article');
		const controls = document.querySelector<HTMLElement>('[data-learn-controls]');
		// Both the content and the controls must be present before wiring.
		if (root && controls) {
			setup(root);
			observer?.disconnect();
			observer = undefined;
			return true;
		}
		return false;
	};

	if (!run()) {
		observer = new MutationObserver(() => {
			run();
		});
		observer.observe(document.body, { childList: true, subtree: true });
		// Safety: stop observing after a few seconds even if nothing matched.
		window.setTimeout(() => observer?.disconnect(), 8000);
	}

	document.addEventListener('astro:page-load', run);
}
