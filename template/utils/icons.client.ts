import iconDescriptions from '@db-ux/db-theme-icons/build/assets/descriptions.json';
import { waitForElements } from '@template/utils/client.utils.ts';

function initIconGallery(): boolean {
	const gallery = document.getElementById('icon-gallery');
	const searchInputWrapper = document.getElementById('icon-search-input');

	if (!gallery || !searchInputWrapper) return false;

	let searchInput = searchInputWrapper.querySelector('input');
	if (!searchInput) {
		searchInput = document.querySelector('input[type="search"]');
	}
	if (!searchInput) return false;

	const buttons = Array.from(gallery.querySelectorAll<HTMLButtonElement>('.icon-item'));
	const iconMap = new Map();

	buttons.forEach((button) => {
		const iconKey = button.getAttribute('data-icon-key');
		const iconName = button.getAttribute('data-icon-name');
		if (iconKey && iconName) {
			iconMap.set(button, { iconKey, iconName });
		}
	});

	gallery.addEventListener('click', (e) => {
		if (!(e.target instanceof Element)) return;

		const button = e.target.closest<HTMLButtonElement>('.icon-item');
		if (!button) return;

		const iconData = iconMap.get(button);
		if (!iconData) return;

		navigator.clipboard.writeText(iconData.iconName);

		const tooltip = button.querySelector('.db-tooltip');
		if (tooltip) {
			const originalText = tooltip.textContent;
			tooltip.textContent = 'Copied!';
			setTimeout(() => {
				tooltip.textContent = originalText;
			}, 2000);
		}
	});

	searchInput.addEventListener('input', (e) => {
		const target = e.target as HTMLInputElement;
		const query = target.value.toLowerCase();

		buttons.forEach((button: HTMLButtonElement) => {
			const iconData = iconMap.get(button);
			if (!iconData) {
				button.style.display = 'none';
				return;
			}

			if (!query) {
				button.style.display = '';
				return;
			}

			const descData = (iconDescriptions as any)[iconData.iconKey];
			if (!descData) {
				button.style.display = 'none';
				return;
			}

			if (iconData.iconName.toLowerCase().includes(query)) {
				button.style.display = '';
				return;
			}

			const enDefault = descData.en?.default || [];
			const enContextual = descData.en?.contextual || [];
			if ([...enDefault, ...enContextual].some((desc) => desc.toLowerCase().includes(query))) {
				button.style.display = '';
				return;
			}

			const deDefault = descData.de?.default || [];
			const deContextual = descData.de?.contextual || [];
			if ([...deDefault, ...deContextual].some((desc) => desc.toLowerCase().includes(query))) {
				button.style.display = '';
				return;
			}

			button.style.display = 'none';
		});
	});

	return true;
}

waitForElements(initIconGallery);
