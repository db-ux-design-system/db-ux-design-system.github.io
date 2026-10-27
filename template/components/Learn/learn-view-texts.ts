export type Lang = 'en' | 'de';

export const learnViewTexts = {
	en: {
		article: 'Article',
		steps: 'Steps',
		viewLabel: 'View',
		back: 'Back',
		next: 'Next',
		stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
		moreInfo: 'Show more',
		lessInfo: 'Show less',
	},
	de: {
		article: 'Artikel',
		steps: 'Schritte',
		viewLabel: 'Ansicht',
		back: 'Zurück',
		next: 'Weiter',
		stepOf: (current: number, total: number) => `Schritt ${current} von ${total}`,
		moreInfo: 'Mehr anzeigen',
		lessInfo: 'Weniger anzeigen',
	},
} as const satisfies Record<Lang, Record<string, unknown>>;
