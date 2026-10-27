/**
 * Search field and category filter tags of ChildPageOverview with `searchable`.
 *
 * The overview is rendered inside the client:only React Shell, so its markup appears
 * after this script runs and again after every ClientRouter navigation. Delegated
 * listeners on the document avoid waiting for the mount: they handle every overview,
 * whenever it exists.
 *
 * Every linked teaser carries its search text in `data-search` (title, description,
 * category and keywords, lowercase) and its category in `data-category`.
 *
 * - Search: if some cards contain the whole query as a phrase, only those are shown
 *   ("web components" does not match "web tool … components"). Otherwise a card is
 *   shown when it contains every word of the query.
 * - Categories: no tag selected shows every category, several tags combine with OR,
 *   like the filter of the release notes.
 * - A card is shown when it matches both.
 */

const ROOT = '[data-child-page-search]';
const CATEGORY = '[data-child-page-search-category]';

const normalize = (value: string) =>
	value
		.toLowerCase()
		// Treats "web components" and "web-components" alike.
		.replace(/[-_/]+/g, ' ')
		.trim();

function update(root: HTMLElement) {
	const input = root.querySelector<HTMLInputElement>('input[type="search"]');
	const phrase = normalize(input?.value ?? '').replace(/\s+/g, ' ');
	const words = phrase.split(' ').filter(Boolean);
	const categories = Array.from(root.querySelectorAll<HTMLInputElement>(CATEGORY))
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => checkbox.value);

	const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-search]')).map((element) => ({
		element,
		text: normalize(element.dataset.search ?? ''),
		inCategory: categories.length === 0 || categories.includes(element.dataset.category ?? ''),
	}));
	const byPhrase =
		words.length > 1 && cards.some(({ text, inCategory }) => inCategory && text.includes(phrase));

	let shown = 0;
	for (const { element, text, inCategory } of cards) {
		const matchesSearch = byPhrase
			? text.includes(phrase)
			: words.every((word) => text.includes(word));
		const match = inCategory && matchesSearch;
		element.hidden = !match;
		if (match) shown += 1;
	}

	const status = root.querySelector<HTMLElement>('[data-child-page-search-status]');
	if (status) {
		status.textContent = (root.dataset.countTemplate ?? '{shown} / {total}')
			.replace('{shown}', String(shown))
			.replace('{total}', String(cards.length));
	}
	const empty = root.querySelector<HTMLElement>('[data-child-page-search-empty]');
	if (empty) empty.hidden = shown > 0;
}

export function initChildPageSearch() {
	const flag = window as Window & { __dbUxChildPageSearch?: boolean };
	if (flag.__dbUxChildPageSearch) return;
	flag.__dbUxChildPageSearch = true;

	document.addEventListener('input', (event) => {
		const input = event.target;
		if (!(input instanceof HTMLInputElement) || input.type !== 'search') return;
		const root = input.closest<HTMLElement>(ROOT);
		if (root) update(root);
	});

	document.addEventListener('change', (event) => {
		const checkbox = event.target;
		if (!(checkbox instanceof HTMLInputElement) || !checkbox.matches(CATEGORY)) return;
		const root = checkbox.closest<HTMLElement>(ROOT);
		if (root) update(root);
	});

	// Escape clears the search, like the native clear button of a search field.
	document.addEventListener('keydown', (event) => {
		const input = event.target;
		if (event.key !== 'Escape' || !(input instanceof HTMLInputElement)) return;
		if (input.type !== 'search' || !input.value) return;
		const root = input.closest<HTMLElement>(ROOT);
		if (!root) return;
		input.value = '';
		update(root);
	});
}
