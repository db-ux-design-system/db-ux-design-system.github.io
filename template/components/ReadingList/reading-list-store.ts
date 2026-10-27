import { useSyncExternalStore } from 'react';

/**
 * The reading list, kept in localStorage.
 *
 * Pages get onto the list in two ways: the bookmark button on a page
 * (ReadingListToggle) and the result of the Get Started wizard. Each page is on the
 * list at most once. New pages are appended at the end.
 *
 * The header button, the bookmark button and the wizard are separate React roots.
 * Every write dispatches CHANGE_EVENT on window, so all of them stay in sync. The
 * storage event keeps other tabs in sync.
 */

const STORAGE_KEY = 'db-ux-reading-list';
const CHANGE_EVENT = 'db-ux-reading-list-change';

/**
 * A page on the list. The id is the language-independent EN path without leading
 * slash, plus # and the EN anchor for a section, e.g. `documentation/learn/about`.
 * Wizard pages need no title: their labels come from packagePages in wizard-flow.ts.
 * Pages saved with the bookmark button store their title per language. A language
 * is missing when the page has no version in it.
 */
export type ReadingListItem = {
	id: string;
	title?: { en?: string; de?: string };
	/**
	 * How the page got onto the list: the bookmark button or the wizard. A page keeps
	 * the source it was first added with. Items stored without it count as bookmarks
	 * when they have a title, otherwise as wizard pages.
	 */
	source?: 'bookmark' | 'wizard';
};

export type ReadingList = {
	version: 1;
	items: ReadingListItem[];
	/**
	 * Answers of the last wizard result that was added, e.g. `role=design&designIntent=new`.
	 * Showing the same result again, e.g. after a reload, does not add the pages again,
	 * so pages deleted from the list stay deleted.
	 */
	wizard?: string;
};

const EMPTY: ReadingList = { version: 1, items: [] };

// Fallback when localStorage is blocked (e.g. some private modes): the list then
// lives as long as the page.
let memory: string | null = null;

function readRaw(): string | null {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return memory;
	}
}

function writeRaw(value: string) {
	memory = value;
	try {
		window.localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// Keep the in-memory value.
	}
	window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Ids of pages whose EN anchor changed. Lists saved before keep working: the old id is
 * read as the new one. The roadmap section was dropped from the EN About page; every
 * release note links to the roadmap of its version instead. Status and versioning
 * moved from the About page and from Releases into their own Learn articles.
 */
const RENAMED_IDS: Record<string, string> = {
	'documentation/learn/about#where-to-ask-which-question':
		'documentation/learn/about#where-to-get-help',
	'documentation/learn/about#what-a-status-means': 'documentation/learn/status',
	'documentation/learn/about#every-content-has-a-status': 'documentation/learn/status',
	'documentation/learn/about#roadmap': 'documentation/releases/release-notes',
	'documentation/releases/versioning': 'documentation/learn/versioning',
	'documentation/releases/content-status': 'documentation/learn/status',
};

function parse(raw: string | null): ReadingList {
	if (!raw) return EMPTY;
	try {
		const value = JSON.parse(raw) as Partial<ReadingList>;
		if (value?.version === 1 && Array.isArray(value.items)) {
			const seen = new Set<string>();
			const items = value.items
				.filter((item): item is ReadingListItem => typeof item?.id === 'string')
				.map((item) => (RENAMED_IDS[item.id] ? { ...item, id: RENAMED_IDS[item.id] } : item))
				// A renamed id can match a page that is on the list already.
				.filter((item) => !seen.has(item.id) && Boolean(seen.add(item.id)));
			return { version: 1, items, wizard: value.wizard };
		}
	} catch {
		// Invalid JSON: treated like an empty list.
	}
	return EMPTY;
}

let cachedRaw: string | null = null;
let cachedList: ReadingList = EMPTY;

/** The stored list. Returns the same object as long as the stored value is unchanged. */
export function getSnapshot(): ReadingList {
	const raw = readRaw();
	if (raw !== cachedRaw) {
		cachedRaw = raw;
		cachedList = parse(raw);
	}
	return cachedList;
}

const write = (list: ReadingList) => writeRaw(JSON.stringify(list));

/** Appends the items that are not on the list yet. */
function append(list: ReadingList, items: ReadingListItem[]): ReadingListItem[] {
	const ids = new Set(list.items.map((item) => item.id));
	const added = items.filter((item) => !ids.has(item.id) && ids.add(item.id));
	return [...list.items, ...added];
}

/** Adds a page at the end of the list. Does nothing when it is already on it. */
export function addItem(item: ReadingListItem) {
	const list = getSnapshot();
	if (list.items.some(({ id }) => id === item.id)) return;
	write({ ...list, items: append(list, [item]) });
}

/** Removes a page from the list. */
export function removeItem(id: string) {
	const list = getSnapshot();
	if (!list.items.some((item) => item.id === id)) return;
	write({ ...list, items: list.items.filter((item) => item.id !== id) });
}

/**
 * Removes all pages. The key of the last wizard result stays, so a reload of that
 * result does not bring its pages back. Going through the wizard again adds them (see
 * addWizardResult, force).
 */
export function clearItems() {
	const list = getSnapshot();
	if (list.items.length === 0) return;
	write({ ...list, items: [] });
}

/**
 * Which group an item belongs to. Same rule as resolveItems, kept here to avoid an
 * import between the two modules: items stored without a source count as bookmarks
 * when they have a title, otherwise as wizard pages.
 */
const isWizardItem = (item: ReadingListItem) =>
	(item.source ?? (item.title ? 'bookmark' : 'wizard')) === 'wizard';

/**
 * Puts the pages of a wizard result on the list. Only one result is on it at a time:
 * the pages of the previous one are dropped, the pages saved with the bookmark button
 * stay and keep their place. A page of the result that is already a bookmark stays a
 * bookmark. The same result is only added once in a row (see ReadingList.wizard), so
 * a reload does not bring back pages that were deleted. force skips that check, for a
 * result the user reached by going through the wizard.
 */
export function addWizardResult(answersKey: string, ids: string[], force = false) {
	const list = getSnapshot();
	// Skipped for the result added last, unless the user reached it again by going
	// through the wizard (force): a reload or a shared link must not bring back pages
	// that were deleted, a deliberate new run must.
	if (list.wizard === answersKey && !force) return;
	const withoutPrevious = { ...list, items: list.items.filter((item) => !isWizardItem(item)) };
	write({
		version: 1,
		items: append(
			withoutPrevious,
			ids.map((id) => ({ id, source: 'wizard' as const })),
		),
		wizard: answersKey,
	});
}

/** Calls the callback on every change in this tab and in other tabs. */
export function subscribe(callback: () => void) {
	const onStorage = (event: StorageEvent) => {
		if (event.key === STORAGE_KEY || event.key === null) callback();
	};
	window.addEventListener(CHANGE_EVENT, callback);
	window.addEventListener('storage', onStorage);
	return () => {
		window.removeEventListener(CHANGE_EVENT, callback);
		window.removeEventListener('storage', onStorage);
	};
}

/** The stored list, updated on every change. Empty on the server. */
export const useReadingList = () => useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
