/**
 * Behaviour of the icon gallery (template/components/IconGallery):
 * search, size and family of the preview, filter for icons with a filled
 * form, copying the name, and the status message for screen readers.
 */
import iconDescriptions from '@db-ux/db-theme-icons/build/assets/descriptions.json';
import { waitForElements } from '@template/utils/client.utils.ts';

type Descriptions = Record<
	string,
	Record<'en' | 'de', { default?: string[]; contextual?: string[] } | undefined>
>;

const descriptions = iconDescriptions as Descriptions;

/** All search terms of an icon: its name and the EN and DE descriptions. */
const searchTerms = (key: string, name: string): string[] => {
	const entry = descriptions[key];
	return [
		name,
		...(entry?.en?.default ?? []),
		...(entry?.en?.contextual ?? []),
		...(entry?.de?.default ?? []),
		...(entry?.de?.contextual ?? []),
	].map((term) => term.toLowerCase());
};

/**
 * The form element with the id, or the one inside it (the React components
 * may put the id on a wrapper). Null until the element of that type exists.
 */
const inputOf = <T extends HTMLElement>(
	id: string,
	type: new () => T,
	selector: string,
): T | null => {
	const element = document.getElementById(id);
	if (element instanceof type) return element;
	const inner = element?.querySelector(selector);
	return inner instanceof type ? inner : null;
};

/** Time without typing before the match count is announced. */
const STATUS_DELAY = 500;
/** How long the tooltip shows "Copied". */
const COPIED_DURATION = 2000;

function initIconGallery(): boolean {
	const wrapper = document.querySelector<HTMLElement>('.icon-gallery-wrapper');
	const gallery = document.getElementById('icon-gallery');
	const status = document.getElementById('icon-gallery-status');
	const copiedStatus = document.getElementById('icon-gallery-copied');
	const search = inputOf('icon-search-input', HTMLInputElement, 'input');
	const size = inputOf('icon-size-select', HTMLSelectElement, 'select');
	const family = inputOf('icon-family-select', HTMLSelectElement, 'select');
	const onlyFilled = inputOf('icon-filled-filter', HTMLInputElement, 'input');
	const buttons = gallery
		? Array.from(gallery.querySelectorAll<HTMLButtonElement>('.icon-item'))
		: [];

	if (
		!wrapper ||
		!gallery ||
		!status ||
		!search ||
		!size ||
		!family ||
		!onlyFilled ||
		buttons.length === 0
	) {
		return false;
	}

	const texts = {
		count: wrapper.dataset.textCount ?? '{count}',
		copied: wrapper.dataset.textCopied ?? '{name}',
		copyFailed: wrapper.dataset.textCopyFailed ?? '{name}',
	};

	const icons = buttons.map((button) => {
		const name = button.dataset.iconName ?? '';
		return {
			button,
			name,
			terms: searchTerms(button.dataset.iconKey ?? '', name),
			// Sizes in which the icon has a filled form, e.g. "28 32".
			filledSizes: (button.dataset.filledSizes ?? '').split(' ').filter(Boolean),
		};
	});

	let statusTimer: ReturnType<typeof setTimeout> | undefined;

	const update = () => {
		const query = search.value.trim().toLowerCase();
		let visible = 0;
		for (const icon of icons) {
			const matches =
				(!query || icon.terms.some((term) => term.includes(query))) &&
				(!onlyFilled.checked || icon.filledSizes.includes(size.value));
			icon.button.style.display = matches ? '' : 'none';
			if (matches) visible++;
		}
		// Announce the count once typing pauses, not on every keystroke.
		clearTimeout(statusTimer);
		statusTimer = setTimeout(() => {
			status.textContent = texts.count.replace('{count}', String(visible));
		}, STATUS_DELAY);
	};

	const updatePreview = () => {
		gallery.style.setProperty('--icon-gallery-size', size.value);
		gallery.style.setProperty(
			'--icon-gallery-family',
			family.value === 'filled' ? "'db-filled'" : "'db-default'",
		);
	};

	// The selects are uncontrolled (a `value` prop would reset them on every
	// render), so the default size is selected here.
	size.value = wrapper.dataset.defaultSize ?? size.value;

	search.addEventListener('input', update);
	onlyFilled.addEventListener('change', update);
	size.addEventListener('change', () => {
		updatePreview();
		// Which icons have a filled form depends on the size.
		if (onlyFilled.checked) update();
	});
	family.addEventListener('change', updatePreview);

	/** Sets the text of a live region so that it is announced again even if it is unchanged. */
	const announce = (region: HTMLElement, message: string) => {
		region.textContent = '';
		requestAnimationFrame(() => {
			region.textContent = message;
		});
	};

	const copiedTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

	gallery.addEventListener('click', async (event) => {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest<HTMLButtonElement>('.icon-item');
		const name = button?.dataset.iconName;
		if (!button || !name) return;

		try {
			await navigator.clipboard.writeText(name);
		} catch {
			if (copiedStatus) announce(copiedStatus, texts.copyFailed.replace('{name}', name));
			return;
		}
		if (copiedStatus) announce(copiedStatus, texts.copied.replace('{name}', name));

		// The tooltip switches to "Copied" via CSS; its content stays untouched.
		clearTimeout(copiedTimers.get(button));
		button.dataset.copied = 'true';
		copiedTimers.set(
			button,
			setTimeout(() => {
				delete button.dataset.copied;
			}, COPIED_DURATION),
		);
	});

	return true;
}

waitForElements(initIconGallery);
