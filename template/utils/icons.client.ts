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

const inputOf = <T extends HTMLElement>(id: string, selector: string): T | null =>
	document.getElementById(id)?.querySelector<T>(selector) ??
	(document.getElementById(id) as T | null);

function initIconGallery(): boolean {
	const wrapper = document.querySelector<HTMLElement>('.icon-gallery-wrapper');
	const gallery = document.getElementById('icon-gallery');
	const status = document.getElementById('icon-gallery-status');
	const search = inputOf<HTMLInputElement>('icon-search-input', 'input');
	const size = inputOf<HTMLSelectElement>('icon-size-select', 'select');
	const family = inputOf<HTMLSelectElement>('icon-family-select', 'select');
	const onlyFilled = inputOf<HTMLInputElement>('icon-filled-filter', 'input');
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
		copiedTooltip: wrapper.dataset.textCopiedTooltip ?? '',
	};

	const icons = buttons.map((button) => {
		const name = button.dataset.iconName ?? '';
		return {
			button,
			name,
			terms: searchTerms(button.dataset.iconKey ?? '', name),
			hasFilled: button.dataset.hasFilled === 'true',
		};
	});

	const update = () => {
		const query = search.value.trim().toLowerCase();
		let visible = 0;
		for (const icon of icons) {
			const matches =
				(!query || icon.terms.some((term) => term.includes(query))) &&
				(!onlyFilled.checked || icon.hasFilled);
			icon.button.style.display = matches ? '' : 'none';
			if (matches) visible++;
		}
		status.textContent = texts.count.replace('{count}', String(visible));
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
	size.addEventListener('change', updatePreview);
	family.addEventListener('change', updatePreview);

	gallery.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest<HTMLButtonElement>('.icon-item');
		const name = button?.dataset.iconName;
		if (!button || !name) return;

		void navigator.clipboard.writeText(name);
		status.textContent = texts.copied.replace('{name}', name);

		const tooltip = button.querySelector('.db-tooltip');
		if (tooltip && texts.copiedTooltip) {
			tooltip.textContent = texts.copiedTooltip;
			setTimeout(() => {
				tooltip.textContent = name;
			}, 2000);
		}
	});

	return true;
}

waitForElements(initIconGallery);
