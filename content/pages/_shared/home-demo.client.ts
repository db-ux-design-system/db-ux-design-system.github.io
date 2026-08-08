import { waitForElements } from '@template/utils/client.utils.ts';

/**
 * Initializes the interactive demo section on the home page.
 * Reads tooltip labels from data attributes on the toggle-mode button
 * to support localization without duplicating logic.
 */
function initDemo(): boolean {
	const iframe = document.querySelector<HTMLIFrameElement>('[id="demo-iframe"]');
	const toggle = document.getElementById('toggle-demo');
	const toggleMode = document.getElementById('toggle-mode');
	const fullscreenAnchor: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>(
		'[id="fullscreen-anchor"]',
	);

	if (!iframe || !toggle || !toggleMode || !fullscreenAnchor) return false;

	const darkLabel = toggleMode.getAttribute('data-label-dark') || 'Toggle dark mode';
	const lightLabel = toggleMode.getAttribute('data-label-light') || 'Toggle light mode';

	let currentDemo = 'b2b';
	let currentMode = 'light';

	fullscreenAnchor.href = iframe.src;

	toggle.addEventListener('click', () => {
		currentDemo = currentDemo === 'b2b' ? 'b2c' : 'b2b';
		const href = `/demo-${currentDemo}`;
		iframe.src = href;
		fullscreenAnchor.href = href;
		toggle.textContent = currentDemo === 'b2b' ? 'B2C' : 'B2B';
	});

	toggleMode.addEventListener('click', () => {
		currentMode = currentMode === 'light' ? 'dark' : 'light';
		iframe.src = `/demo-${currentDemo}?mode=${currentMode}`;
		toggleMode.setAttribute('data-icon', currentMode === 'light' ? 'moon' : 'sun');
		toggleMode.setAttribute('title', currentMode === 'light' ? darkLabel : lightLabel);
		const tooltip = toggleMode.querySelector('.db-tooltip');
		if (tooltip) tooltip.textContent = currentMode === 'light' ? darkLabel : lightLabel;
	});

	document.addEventListener('click', (e) => {
		const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-action]');
		if (!target) return;

		const action = target.dataset.action;
		const value = target.dataset.value;
		if (action && value) {
			iframe.src = `/demo-${currentDemo}?${action}=${value}`;
		}
	});

	return true;
}

document.addEventListener('astro:page-load', () => {
	waitForElements(initDemo);
});

waitForElements(initDemo);
