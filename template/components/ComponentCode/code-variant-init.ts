/*
 * PROTOTYPE – comparison of two Code section variants (see PR #832).
 *
 * Both variants are rendered on the page; `?code=slim` shows the slim one,
 * anything else the full one. Remove together with the losing variant.
 */
const applyVariant = () => {
	const variant =
		new URLSearchParams(window.location.search).get('code') === 'slim' ? 'slim' : 'full';
	document.documentElement.dataset.codeVariant = variant;
};

applyVariant();
document.addEventListener('astro:page-load', applyVariant);
