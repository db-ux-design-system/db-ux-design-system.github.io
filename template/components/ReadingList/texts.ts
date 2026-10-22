import type { Lang } from '@template/components/GetStartedWizard/wizard-flow';

/** Texts of the reading list, shared by the header button, the bookmark button and the wizard result. */
export const readingListTexts: Record<
	Lang,
	{
		title: string;
		/** Accessible name of the header button. The count is shown as a badge. */
		triggerLabel: (count: number) => string;
		empty: string;
		suggest: string;
		/** Accessible names of the two groups. The groups are only told apart visually otherwise. */
		bookmarkGroup: string;
		wizardGroup: string;
		/** Accessible name of the delete button of a page. */
		remove: (label: string) => string;
		/** Tooltip of the delete button. The row already shows the page. */
		removeShort: string;
		removed: (label: string) => string;
		add: string;
		added: string;
		removeCurrent: string;
		removedCurrent: string;
		/** Intro of the wizard result. */
		intro: string;
	}
> = {
	en: {
		title: 'Reading list',
		triggerLabel: (count) =>
			count === 0
				? 'Reading list, empty'
				: `Reading list, ${count} ${count === 1 ? 'page' : 'pages'}`,
		empty: 'No pages saved yet. Add pages with “Add to reading list”.',
		suggest: 'Get page suggestions',
		bookmarkGroup: 'Saved by you',
		wizardGroup: 'Suggested in Get Started',
		remove: (label) => `Remove: ${label}`,
		removeShort: 'Remove',
		removed: (label) => `Removed: ${label}`,
		add: 'Add to reading list',
		added: 'Added to reading list',
		removeCurrent: 'Remove from reading list',
		removedCurrent: 'Removed from reading list',
		intro:
			'Work through these pages in this order. They are now also on your reading list. Open it on any page with the “Reading list” button in the header.',
	},
	de: {
		title: 'Leseliste',
		triggerLabel: (count) =>
			count === 0 ? 'Leseliste, leer' : `Leseliste, ${count} ${count === 1 ? 'Seite' : 'Seiten'}`,
		empty: 'Noch keine Seiten gemerkt. Füge Seiten über „Zur Leseliste hinzufügen“ hinzu.',
		suggest: 'Passende Seiten vorschlagen lassen',
		bookmarkGroup: 'Von dir gemerkt',
		wizardGroup: 'Vorgeschlagen in Erste Schritte',
		remove: (label) => `Entfernen: ${label}`,
		removeShort: 'Entfernen',
		removed: (label) => `Entfernt: ${label}`,
		add: 'Zur Leseliste hinzufügen',
		added: 'Zur Leseliste hinzugefügt',
		removeCurrent: 'Von der Leseliste entfernen',
		removedCurrent: 'Von der Leseliste entfernt',
		intro:
			'Arbeite diese Seiten der Reihe nach durch. Sie stehen jetzt auch auf deiner Leseliste. Du öffnest sie auf jeder Seite über den Button „Leseliste“ im Header.',
	},
};
