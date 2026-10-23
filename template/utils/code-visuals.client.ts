/**
 * Interactive code visuals on the Products & Services pages.
 *
 * Hover, pressed and focus states of the DB buttons need no script: they come
 * from the DB component CSS. This module only handles the controls that change
 * a preview (Materials, Configurable, Button Playground). Delegated `change` and
 * `input` listeners on `document` work for every instance,
 * survives the client-side rendering of the Shell and ClientRouter navigations,
 * and scopes all queries to the visual root of the changed control.
 */

const MATERIALS = new Set([
	'origin',
	'vibrant',
	'inverted',
	'outlined',
	'semi-transparent',
	'transparent',
]);
const MATERIAL_COLOR_CLASSES = new Set(['', 'db-color-red']);

/** Applies the selected material level to the brand button (faked in MaterialsVisual.css). */
const updateMaterials = (root: HTMLElement, input: HTMLInputElement): void => {
	const button = root.querySelector<HTMLElement>('.materials-visual-button');
	const colorClass = input.dataset.colorClass ?? '';
	if (!button || !MATERIALS.has(input.value) || !MATERIAL_COLOR_CLASSES.has(colorClass)) return;
	button.dataset.material = input.value;
	button.classList.toggle('db-color-red', colorClass === 'db-color-red');
};

/** Allowlist check: the value must be one of the select's own options. */
const isOption = (select: HTMLSelectElement): boolean =>
	[...select.options].some((option) => option.value === select.value);

/**
 * Icon of the icon-only badge; same markup as DBIcon with text (badge.css styles :has(.db-icon)).
 * The icon must not be empty: badge.css sizes `.db-badge > span:empty` as a dot, which squashes
 * an empty icon span and makes the badge oval. The text is hidden by `.db-icon { font-size: 0 }`
 * and serves as the badge's accessible content.
 */
const createIcon = (): HTMLSpanElement => {
	const icon = document.createElement('span');
	icon.className = 'db-icon';
	icon.dataset.icon = 'heart';
	icon.textContent = 'Heart';
	return icon;
};

/** Applies the changed setting to the badge preview (each select maps to one DBBadge property). */
const updateConfigurable = (root: HTMLElement, select: HTMLSelectElement): void => {
	const badge = root.querySelector<HTMLElement>('.configurable-visual-badge');
	if (!badge || !isOption(select)) return;
	const { value } = select;

	switch (select.dataset.control) {
		case 'size':
			badge.dataset.size = value;
			break;
		case 'emphasis':
			badge.dataset.emphasis = value;
			break;
		case 'semantic':
			badge.dataset.semantic = value;
			break;
		case 'content':
			// Dot is an empty badge: badge.css only renders the dot for :empty
			if (value === 'text') badge.replaceChildren('Badge');
			else if (value === 'icon') badge.replaceChildren(createIcon());
			else badge.replaceChildren();
			break;
		default:
	}
};

const BUTTON_VARIANTS = new Set(['brand', 'outlined', 'filled', 'ghost']);

/**
 * Applies the changed control to the button preview of the Button Playground.
 * DB draws the icon only for `[data-icon]:not([data-show-icon=false])`, so toggling
 * `data-show-icon` hides and shows it. An empty text falls back to the default label,
 * so the button never loses its visible text and accessible name.
 */
const updateButtonPlayground = (
	root: HTMLElement,
	control: HTMLInputElement | HTMLSelectElement,
): void => {
	const button = root.querySelector<HTMLElement>('.button-playground-visual-button');
	if (!button) return;
	switch (control.dataset.control) {
		case 'variant':
			if (
				control instanceof HTMLSelectElement &&
				isOption(control) &&
				BUTTON_VARIANTS.has(control.value)
			) {
				button.dataset.variant = control.value;
			}
			break;
		case 'icon':
			if (control instanceof HTMLSelectElement && isOption(control)) {
				button.dataset.icon = control.value;
			}
			break;
		case 'show-icon':
			if (control instanceof HTMLInputElement && control.type === 'checkbox') {
				button.dataset.showIcon = String(control.checked);
				// The icon only matters with Show Icon on; the selected icon is kept
				const iconSelect = root.querySelector<HTMLSelectElement>('select[data-control="icon"]');
				if (iconSelect) iconSelect.disabled = !control.checked;
			}
			break;
		case 'text':
			if (control instanceof HTMLInputElement && control.type === 'text') {
				button.textContent = control.value.trim() || (root.dataset.defaultText ?? '');
			}
			break;
		default:
	}
};

document.addEventListener('change', (event) => {
	const target = event.target;
	if (!(target instanceof HTMLElement)) return;
	const root = target.closest<HTMLElement>('[data-code-visual]');
	if (!root) return;

	if (
		root.dataset.codeVisual === 'materials' &&
		target instanceof HTMLInputElement &&
		target.type === 'radio'
	) {
		updateMaterials(root, target);
	} else if (
		root.dataset.codeVisual === 'configurable' &&
		target instanceof HTMLSelectElement &&
		target.dataset.control
	) {
		updateConfigurable(root, target);
	} else if (
		root.dataset.codeVisual === 'button-playground' &&
		(target instanceof HTMLSelectElement || target instanceof HTMLInputElement) &&
		target.dataset.control
	) {
		updateButtonPlayground(root, target);
	}
});

// Live label update while typing (the change event only fires on blur)
document.addEventListener('input', (event) => {
	const target = event.target;
	if (!(target instanceof HTMLInputElement) || target.dataset.control !== 'text') return;
	const root = target.closest<HTMLElement>('[data-code-visual="button-playground"]');
	if (root) updateButtonPlayground(root, target);
});
