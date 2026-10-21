import { useSyncExternalStore } from 'react';

/**
 * The learning package from the Get Started wizard, kept in localStorage.
 *
 * The wizard island and the Shell island are separate React roots. Every write
 * dispatches CHANGE_EVENT on window, so both stay in sync. The storage event keeps
 * other tabs in sync. Only language-independent data is stored: labels and
 * descriptions come from packagePages in wizard-flow.ts at render time.
 */

const STORAGE_KEY = 'db-ux-learning-package';
const CHANGE_EVENT = 'db-ux-learning-package-change';

export type StoredItem = { id: string };

/**
 * Packages saved by an earlier version also contain path, anchor and savedAt. These
 * fields are not read and do not affect the check in parse().
 */
export type StoredPackage = {
	version: 1;
	/**
	 * Answers that led to the package, e.g. { role: 'design', designIntent: 'new' }. Only
	 * used to tell whether a new result is the same package.
	 */
	answers: Record<string, string>;
	/** Pages in the order they should be worked through. */
	items: StoredItem[];
	/** Ids of the items marked as viewed. */
	viewed: string[];
};

// Fallback when localStorage is blocked (e.g. some private modes): the package then
// lives as long as the page.
let memory: string | null = null;

function readRaw(): string | null {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return memory;
	}
}

function writeRaw(value: string | null) {
	memory = value;
	try {
		if (value === null) window.localStorage.removeItem(STORAGE_KEY);
		else window.localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// Keep the in-memory value.
	}
	window.dispatchEvent(new Event(CHANGE_EVENT));
}

function parse(raw: string | null): StoredPackage | null {
	if (!raw) return null;
	try {
		const value = JSON.parse(raw) as Partial<StoredPackage>;
		if (
			value?.version === 1 &&
			Array.isArray(value.items) &&
			Array.isArray(value.viewed) &&
			value.answers &&
			typeof value.answers === 'object'
		) {
			return value as StoredPackage;
		}
	} catch {
		// Invalid JSON: treated like a missing package.
	}
	return null;
}

let cachedRaw: string | null = null;
let cachedPackage: StoredPackage | null = null;

/** The stored package. Returns the same object as long as the stored value is unchanged. */
export function getSnapshot(): StoredPackage | null {
	const raw = readRaw();
	if (raw !== cachedRaw) {
		cachedRaw = raw;
		cachedPackage = parse(raw);
	}
	return cachedPackage;
}

/** Reads the package and removes a stored value that cannot be used. */
function readPackage(): StoredPackage | null {
	const pkg = getSnapshot();
	if (!pkg && readRaw() !== null) writeRaw(null);
	return pkg;
}

/** True when both answer sets contain the same answers. */
function sameAnswers(a: Record<string, string>, b: Record<string, string | undefined>) {
	const keysA = Object.keys(a).filter((key) => a[key]);
	const keysB = Object.keys(b).filter((key) => b[key]);
	return keysA.length === keysB.length && keysA.every((key) => a[key] === b[key]);
}

/**
 * Saves a new package. Items that are also in the previous package keep their viewed
 * state. Saving the same package again changes nothing.
 */
export function savePackage(answers: Record<string, string | undefined>, items: StoredItem[]) {
	const previous = readPackage();
	const ids = items.map((item) => item.id);
	if (
		previous &&
		sameAnswers(previous.answers, answers) &&
		previous.items.length === ids.length &&
		previous.items.every((item, index) => item.id === ids[index])
	) {
		return;
	}
	const cleanAnswers: Record<string, string> = {};
	for (const [key, value] of Object.entries(answers)) if (value) cleanAnswers[key] = value;
	const pkg: StoredPackage = {
		version: 1,
		answers: cleanAnswers,
		items,
		viewed: previous ? previous.viewed.filter((id) => ids.includes(id)) : [],
	};
	writeRaw(JSON.stringify(pkg));
}

/** Marks an item of the stored package as viewed or not viewed. */
export function setViewed(id: string, viewed: boolean) {
	const pkg = readPackage();
	if (!pkg || !pkg.items.some((item) => item.id === id)) return;
	const others = pkg.viewed.filter((item) => item !== id);
	writeRaw(JSON.stringify({ ...pkg, viewed: viewed ? [...others, id] : others }));
}

/** Removes the stored package. */
export function clearPackage() {
	writeRaw(null);
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

/** The stored package, updated on every change. Null on the server and without package. */
export const useLearningPackage = () => useSyncExternalStore(subscribe, getSnapshot, () => null);
