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
	}
> = {
	en: {
		title: 'Your next steps',
		triggerLabel: (viewed, total) => `Your next steps, ${viewed}/${total} viewed`,
		progress: (viewed, total) => `${viewed} of ${total} viewed`,
		viewedLabel: (label) => `Viewed: ${label}`,
		restart: 'Start again',
		remove: 'Remove',
		intro:
			'Work through these pages in this order. The list stays saved in this browser. Open it on any page with the light bulb button at the top. There, tick off each page once you have viewed it.',
	},
	de: {
		title: 'Deine nächsten Schritte',
		triggerLabel: (viewed, total) => `Deine nächsten Schritte, ${viewed}/${total} angeschaut`,
		progress: (viewed, total) => `${viewed} von ${total} angeschaut`,
		viewedLabel: (label) => `Angeschaut: ${label}`,
		restart: 'Neu starten',
		remove: 'Entfernen',
		intro:
			'Arbeite diese Seiten der Reihe nach durch. Die Liste bleibt in diesem Browser gespeichert. Öffne sie auf jeder Seite über den Button mit der Glühbirne oben. Hake dort jede Seite ab, sobald du sie angeschaut hast.',
	},
};
