import type { Lang } from '@template/components/GetStartedWizard/wizard-flow';

/** Texts of the reading list, shared by the header button, the bookmark button and the wizard result. */
export const readingListTexts: Record<
	Lang,
	{
		title: string;
		/** Accessible name of the header button. The count is shown as a badge. */
		triggerLabel: (count: number) => string;
		/**
		 * Hint for the empty list, split around the inline bookmark icon. The icon is
		 * decorative; the text names it, so the hint works without seeing it.
		 */
		empty: [before: string, after: string];
		suggest: string;
		/** Accessible names of the two groups. The groups are only told apart visually otherwise. */
		bookmarkGroup: string;
		wizardGroup: string;
		/** Accessible name of the delete button of a page. */
		remove: (label: string) => string;
		removed: (label: string) => string;
		/** Button that empties the whole list, and its status message. */
		removeAll: string;
		removedAll: string;
		add: string;
		added: string;
		removeCurrent: string;
		removedCurrent: string;
		/** Dialog at the end of a saved page: asks whether to remove it from the list. */
		finishedTitle: string;
		finishedText: string;
		finishedKeep: string;
		finishedClose: string;
		/** Intro of the wizard result: points at the package, not at single pages. */
		intro: string;
		/** Headline of the hint on the wizard result: the pages are on the list now. */
		savedTitle: string;
		saved: string;
	}
> = {
	en: {
		title: 'Reading list',
		triggerLabel: (count) =>
			count === 0
				? 'Reading list, empty'
				: `Reading list, ${count} ${count === 1 ? 'page' : 'pages'}`,
		empty: ['No pages saved yet. Save a page with the bookmark', 'next to its headline.'],
		suggest: 'Get page suggestions',
		bookmarkGroup: 'Saved by you',
		wizardGroup: 'Suggested in Get Started',
		remove: (label) => `Remove: ${label}`,
		removed: (label) => `Removed: ${label}`,
		removeAll: 'Remove all',
		removedAll: 'All pages removed from the reading list',
		add: 'Add to reading list',
		added: 'Added to reading list',
		removeCurrent: 'Remove from reading list',
		removedCurrent: 'Removed from reading list',
		finishedTitle: 'Finished reading?',
		finishedText:
			'You have reached the end of this page. Do you want to remove it from your reading list?',
		finishedKeep: 'Keep on list',
		finishedClose: 'Close',
		intro:
			'Your learning package is ready. The pages are ordered so you get through without detours.',
		savedTitle: 'Saved to your reading list',
		saved:
			'Open it on any page with the “Reading list” button in the header. It stays saved in this browser.',
	},
	de: {
		title: 'Leseliste',
		triggerLabel: (count) =>
			count === 0 ? 'Leseliste, leer' : `Leseliste, ${count} ${count === 1 ? 'Seite' : 'Seiten'}`,
		empty: [
			'Noch keine Seiten gemerkt. Merke dir eine Seite über das Lesezeichen',
			'neben ihrer Überschrift.',
		],
		suggest: 'Passende Seiten vorschlagen',
		bookmarkGroup: 'Von dir gemerkt',
		wizardGroup: 'Vorgeschlagen in Erste Schritte',
		remove: (label) => `Entfernen: ${label}`,
		removed: (label) => `Entfernt: ${label}`,
		removeAll: 'Alle entfernen',
		removedAll: 'Alle Seiten von der Leseliste entfernt',
		add: 'Zur Leseliste hinzufügen',
		added: 'Zur Leseliste hinzugefügt',
		removeCurrent: 'Von der Leseliste entfernen',
		removedCurrent: 'Von der Leseliste entfernt',
		finishedTitle: 'Fertig gelesen?',
		finishedText:
			'Du bist am Ende der Seite angekommen. Möchtest du sie von deiner Leseliste entfernen?',
		finishedKeep: 'Auf der Liste behalten',
		finishedClose: 'Schließen',
		intro: 'Dein Lernpaket steht. Die Seiten sind so sortiert, dass du ohne Umwege durchkommst.',
		savedTitle: 'In deiner Leseliste gespeichert',
		saved:
			'Öffne sie jederzeit über den Button „Leseliste“ im Header. Sie bleibt in diesem Browser gespeichert.',
	},
};
