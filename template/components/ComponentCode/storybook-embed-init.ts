/*
 * Keeps embedded Storybook stories in sync with the platform's light/dark mode.
 *
 * The iframe is cross-origin (locally) and has its own document, so the
 * platform's `data-mode` does not reach it. Storybook reads the mode from the
 * `globals` URL parameter instead (`mode` global, see the Storybook preview in
 * core-web), so the src is rewritten whenever `<html data-mode>` changes.
 *
 * Embeds are marked with `data-storybook-embed`; its value is the src without
 * the mode.
 */

const SELECTOR = 'iframe[data-storybook-embed]';

const currentMode = (): 'light' | 'dark' =>
	document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light';

const withMode = (src: string, mode: string): string => {
	const url = new URL(src);
	url.searchParams.set('globals', `mode:${mode}`);
	return url.toString();
};

function syncEmbeds(): boolean {
	const mode = currentMode();
	const embeds = document.querySelectorAll<HTMLIFrameElement>(SELECTOR);
	embeds.forEach((iframe) => {
		const src = withMode(iframe.dataset.storybookEmbed ?? '', mode);
		if (iframe.src !== src) iframe.src = src;
	});
	return embeds.length > 0;
}

let observed = false;
function init(): boolean {
	const found = syncEmbeds();
	if (!observed) {
		observed = true;
		new MutationObserver(syncEmbeds).observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-mode'],
		});
	}
	return found;
}

init();
document.addEventListener('astro:page-load', () => {
	// The Shell renders the content client-side, so the embeds may not exist yet.
	if (init()) return;
	new MutationObserver((_, observer) => {
		if (syncEmbeds()) observer.disconnect();
	}).observe(document.body, { childList: true, subtree: true });
});
