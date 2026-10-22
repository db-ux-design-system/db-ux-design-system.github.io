import type { Lang } from '@template/components/GetStartedWizard/wizard-flow';

/** Texts of the learning package, shared by the wizard result, the list and the popover. */
export const learningPackageTexts: Record<
	Lang,
	{
		title: string;
		triggerLabel: (viewed: number, total: number) => string;
		progress: (viewed: number, total: number) => string;
		/** Accessible name of the checkbox of a page. The label is visually hidden. */
		viewedLabel: (label: string) => string;
		restart: string;
		remove: string;
		intro: string;
		/** Hint on the result page: where the package is kept and how to open it again. */
		savedTitle: string;
		saved: string;
		/** Describes the count badge of the button shown in that hint. */
		badgeLabel: string;
	}
> = {
	en: {
		title: 'Your next steps',
		triggerLabel: (viewed, total) => `Your next steps, ${viewed}/${total} viewed`,
		progress: (viewed, total) => `${viewed} of ${total} viewed`,
		viewedLabel: (label) => `Viewed: ${label}`,
		restart: 'Start again',
		remove: 'Remove',
		intro: 'Work through these pages in this order.',
		savedTitle: 'Saved to your reading list',
		saved:
			'Open your reading list on any page with the bookmark button at the top. There you tick off each page once you have viewed it. The list stays saved in this browser.',
		badgeLabel: 'pages in your reading list',
	},
	de: {
		title: 'Deine nächsten Schritte',
		triggerLabel: (viewed, total) => `Deine nächsten Schritte, ${viewed}/${total} angeschaut`,
		progress: (viewed, total) => `${viewed} von ${total} angeschaut`,
		viewedLabel: (label) => `Angeschaut: ${label}`,
		restart: 'Neu starten',
		remove: 'Entfernen',
		intro: 'Arbeite diese Seiten der Reihe nach durch.',
		savedTitle: 'In deiner Leseliste gespeichert',
		saved:
			'Öffne deine Leseliste auf jeder Seite über den Button mit dem Lesezeichen oben. Dort hakst du jede Seite ab, sobald du sie angeschaut hast. Die Liste bleibt in diesem Browser gespeichert.',
		badgeLabel: 'Seiten in deiner Leseliste',
	},
};
