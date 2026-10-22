export type Lang = 'en' | 'de';

export const learnViewTexts = {
	en: {
		article: 'Article',
		steps: 'Steps',
		viewLabel: 'View',
		back: 'Back',
		next: 'Next',
		finish: 'Finish',
		stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
		moreInfo: 'More information',
	},
	de: {
		article: 'Artikel',
		steps: 'Schritte',
		viewLabel: 'Ansicht',
		back: 'Zurück',
		next: 'Weiter',
		finish: 'Fertig',
		stepOf: (current: number, total: number) => `Schritt ${current} von ${total}`,
		moreInfo: 'Weitere Informationen',
	},
} as const satisfies Record<Lang, Record<string, unknown>>;
