import { waitForElements } from '@template/utils/client.utils.ts';

/** Same key as the ThemeProvider of the demo (template/context/theme-context.tsx). */
const THEME_STORAGE_KEY = 'db-ux-theme';

/** Registered once; initDemo runs again after every ClientRouter navigation. */
let themeStorageListener: ((event: StorageEvent) => void) | undefined;

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

	let currentDemo = 'b2b';
	let currentMode = 'light';

	fullscreenAnchor.href = iframe.src;

	// Icon-only button: the label lives in its aria-label and tooltip, not in text. It names
	// the demo the click switches to, so it flips with the demo.
	const labelB2C = toggle.dataset.labelB2c ?? '';
	const labelB2B = toggle.dataset.labelB2b ?? '';
	const toggleTooltip = toggle.querySelector('.db-tooltip');

	toggle.addEventListener('click', () => {
		currentDemo = currentDemo === 'b2b' ? 'b2c' : 'b2b';
		const href = `/demo-${currentDemo}`;
		iframe.src = href;
		fullscreenAnchor.href = href;
		const label = currentDemo === 'b2b' ? labelB2C : labelB2B;
		toggle.setAttribute('aria-label', label);
		if (toggleTooltip) toggleTooltip.textContent = label;
	});

	// Labels come from the component's data attributes so they exist only once
	// and stay localized on the German page.
	const labelDark = toggleMode.dataset.labelDark ?? '';
	const labelLight = toggleMode.dataset.labelLight ?? '';

	toggleMode.addEventListener('click', () => {
		currentMode = currentMode === 'light' ? 'dark' : 'light';
		iframe.src = `/demo-${currentDemo}?mode=${currentMode}`;
		toggleMode.setAttribute('data-icon', currentMode === 'light' ? 'moon' : 'sun');
		const label = currentMode === 'light' ? labelDark : labelLight;
		toggleMode.setAttribute('aria-label', label);
		const tooltip = toggleMode.querySelector('.db-tooltip');
		if (tooltip) tooltip.textContent = label;
	});

	// Reload the iframe with the chosen query, e.g. the theme select (`?theme=s-bahn`).
	const applyAction = (action: string, value: string) => {
		// Only allow safe query parameter keys and encode key/value for URL context.
		if (!/^[a-zA-Z0-9_-]+$/.test(action)) return;
		iframe.src = `/demo-${currentDemo}?${encodeURIComponent(action)}=${encodeURIComponent(value)}`;
	};

	document.addEventListener('change', (e) => {
		const select = (e.target as HTMLElement)?.closest<HTMLSelectElement>('select[data-action]');
		if (!select) return;
		if (select.dataset.action) applyAction(select.dataset.action, select.value);
	});

	// The demo stores its theme (theme-context.tsx) and restores it after a reload. The
	// select shows that stored theme, so it never disagrees with the iframe.
	const themeSelect = document.querySelector<HTMLSelectElement>('select[data-action="theme"]');
	const syncThemeSelect = () => {
		if (!themeSelect) return;
		let stored: string | null = null;
		try {
			stored = window.localStorage.getItem(THEME_STORAGE_KEY);
		} catch {
			// Blocked storage: the demo falls back to the default theme as well.
		}
		const known = [...themeSelect.options].some((option) => option.value === stored);
		themeSelect.value = known && stored ? stored : 'default';
	};
	syncThemeSelect();
	// The theme switch inside the demo writes the same key; the page gets a storage event.
	if (!themeStorageListener) {
		themeStorageListener = (event: StorageEvent) => {
			if (event.key === THEME_STORAGE_KEY) syncThemeSelect();
		};
		window.addEventListener('storage', themeStorageListener);
	}

	return true;
}

document.addEventListener('astro:page-load', () => {
	waitForElements(initDemo);
});

waitForElements(initDemo);
