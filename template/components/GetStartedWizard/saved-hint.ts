/**
 * Remembers whether the hint about the reading list was shown on a wizard result.
 *
 * The first result ever shows it until it is closed. From then on it is only shown
 * for a few seconds, because the button it explains stays in the header anyway. The
 * flag is global: it is not kept per learning package.
 *
 * Own key instead of a field in the reading list, so the two features do not share a
 * storage format. Deleting the reading list does not reset the hint.
 */
const STORAGE_KEY = 'db-ux-reading-list-hint';

// Fallback when localStorage is blocked (e.g. some private modes): the flag then
// lives as long as the page.
let memory = false;

export function hasSeenSavedHint(): boolean {
	try {
		return window.localStorage.getItem(STORAGE_KEY) === 'seen';
	} catch {
		return memory;
	}
}

export function markSavedHintSeen() {
	memory = true;
	try {
		window.localStorage.setItem(STORAGE_KEY, 'seen');
	} catch {
		// Keep the in-memory flag.
	}
}
