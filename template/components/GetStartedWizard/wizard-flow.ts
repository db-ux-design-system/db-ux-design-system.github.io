/**
 * Decision tree of the Get Started wizard.
 *
 * Every path ends in a learning package: an ordered list of documentation pages to
 * work through. The pages come from the packagePages catalog. When a page moves, update its
 * path there. Paths are EN content paths; toHref turns them into DE URLs with
 * toDeSlug. Anchors differ per language, so they are part of the localized text.
 */

import { toDeSlug } from '@template/i18n/slug-mapping';

export type Lang = 'en' | 'de';
export type Text = Record<Lang, string>;

export type QuestionId =
	| 'role'
	| 'designIntent'
	| 'developmentIntent'
	| 'productIntent'
	| 'projectBasis'
	| 'productBasis'
	| 'framework'
	| 'dbProduct';

export type Option = {
	id: string;
	label: Text;
	description?: Text;
};

export type Question = {
	id: QuestionId;
	title: Text;
	options: Option[];
};

/**
 * A documentation page or a section of it. The id is language independent. The
 * reading list stores pages by their full EN path instead (toReadingListId).
 */
export type PackagePage = {
	id: string;
	path: string;
	anchor?: Text;
	label: Text;
	description: Text;
};

/** The learning package at the end of a path. The first item is the main page. */
export type Result = {
	title: Text;
	description: Text;
	/** Label of the button that links to the first item. */
	cta: Text;
	items: PackagePage[];
};

export type Answers = Partial<Record<QuestionId, string>>;

const t = (en: string, de: string): Text => ({ en, de });

const intentOptions = (newText: Text, existingText: Text, learnText: Text): Option[] => [
	{ id: 'new', label: t('New project', 'Neues Projekt'), description: newText },
	{
		id: 'existing',
		label: t('Existing project', 'Bestehendes Projekt'),
		description: existingText,
	},
	{
		id: 'learn',
		label: t('Explore', 'Kennenlernen'),
		description: learnText,
	},
];

const basisOptions: Option[] = [
	{
		id: 'dbui',
		label: t('DB UI', 'DB UI'),
		description: t(
			'Generation 2, the previous generation of the design system.',
			'Generation 2, die vorherige Generation des Design Systems.',
		),
	},
	{
		id: 'other',
		label: t('Other', 'Andere Grundlage'),
		description: t(
			'Own components or another library.',
			'Eigene Komponenten oder eine andere Bibliothek.',
		),
	},
];

export const questions: Record<QuestionId, Question> = {
	role: {
		id: 'role',
		title: t('What is your role?', 'Was ist deine Rolle?'),
		options: [
			{
				id: 'design',
				label: t('Designer', 'Designer:in'),
			},
			{
				id: 'development',
				label: t('Developer', 'Entwickler:in'),
			},
			{
				id: 'product',
				label: t('Product manager', 'Produktmanager:in'),
			},
		],
	},
	designIntent: {
		id: 'designIntent',
		title: t('What are you about to do?', 'Was hast du vor?'),
		options: intentOptions(
			t(
				'Set up the Figma libraries for a new file.',
				'Richte die Figma-Bibliotheken für eine neue Datei ein.',
			),
			t(
				'Move existing designs onto the design system.',
				'Stelle bestehende Designs auf das Design System um.',
			),
			t(
				'Find out what it contains and how binding it is.',
				'Erfahre, was es enthält und wie verbindlich es ist.',
			),
		),
	},
	developmentIntent: {
		id: 'developmentIntent',
		title: t('What are you about to do?', 'Was hast du vor?'),
		options: intentOptions(
			t('Install the packages for your framework.', 'Installiere die Pakete für dein Framework.'),
			t(
				'Move an existing code base onto the packages.',
				'Stelle eine bestehende Codebasis auf die Pakete um.',
			),
			t(
				'Try the components and look at example projects.',
				'Probiere die Komponenten aus und sieh dir Beispielprojekte an.',
			),
		),
	},
	productIntent: {
		id: 'productIntent',
		title: t('What are you about to do?', 'Was hast du vor?'),
		options: [
			{
				id: 'evaluate',
				label: t('Evaluate', 'Bewerten'),
				description: t(
					'What it contains, what a status means and how binding it is.',
					'Was es enthält, was ein Status bedeutet und wie verbindlich es ist.',
				),
			},
			{
				id: 'plan',
				label: t('Plan adoption', 'Einführung planen'),
				description: t(
					'How releases are versioned and announced.',
					'Wie Releases versioniert und angekündigt werden.',
				),
			},
			{
				id: 'existing',
				label: t('Existing product', 'Bestehendes Produkt'),
				description: t(
					'What changes when a product moves onto the design system.',
					'Was sich ändert, wenn ein Produkt auf das Design System wechselt.',
				),
			},
			{
				id: 'follow',
				label: t('Follow updates', 'Updates verfolgen'),
				description: t('Release notes and the roadmap.', 'Release Notes und die Roadmap.'),
			},
		],
	},
	projectBasis: {
		id: 'projectBasis',
		title: t('What is your project based on?', 'Worauf basiert dein Projekt?'),
		options: basisOptions,
	},
	productBasis: {
		id: 'productBasis',
		title: t('What is your product based on?', 'Worauf basiert dein Produkt?'),
		options: basisOptions,
	},
	framework: {
		id: 'framework',
		title: t('What do you build your interface with?', 'Womit baust du dein Interface?'),
		options: [
			{ id: 'react', label: t('React', 'React') },
			{ id: 'angular', label: t('Angular', 'Angular') },
			{ id: 'vue', label: t('Vue', 'Vue') },
			{ id: 'web-components', label: t('Web Components', 'Web Components') },
			{ id: 'core-components', label: t('HTML and CSS', 'HTML und CSS') },
			{ id: 'astro', label: t('Astro', 'Astro') },
			{ id: 'core-foundations', label: t('Own components', 'Eigene Komponenten') },
			{ id: 'native', label: t('iOS or Android', 'iOS oder Android') },
		],
	},
	dbProduct: {
		id: 'dbProduct',
		title: t(
			'Do you build a product of Deutsche Bahn?',
			'Baust du ein Produkt der Deutschen Bahn?',
		),
		options: [
			{
				id: 'yes',
				label: t('Yes', 'Ja'),
				description: t('You also need the DB Theme.', 'Du brauchst zusätzlich das DB Theme.'),
			},
			{
				id: 'no',
				label: t('No', 'Nein'),
				description: t('The whitelabel theme is enough.', 'Das Whitelabel-Theme reicht.'),
			},
		],
	},
};

/**
 * DB UX data-color per role. Before a pick, all role tiles show their own color. Once
 * a role is picked, only the selected card is tinted: the picked role tile, and on
 * every later step the selected card in the color of the chosen role. The result card
 * is tinted in that color as well. Unselected cards stay neutral.
 */
export const roleColors: Record<string, string> = {
	design: 'blue',
	development: 'green',
	product: 'violet',
};

/** The color of the chosen path, or undefined before a role is picked. */
export const roleColor = (answers: Answers): string | undefined =>
	answers.role ? roleColors[answers.role] : undefined;

const page = (id: string, label: Text, description: Text, anchor?: Text): PackagePage => ({
	id: anchor ? `${id}#${anchor.en}` : id,
	path: `/documentation/${id}`,
	anchor,
	label,
	description,
});

const frameworkNames: Record<string, Text> = {
	react: t('React', 'React'),
	angular: t('Angular', 'Angular'),
	vue: t('Vue', 'Vue'),
	'web-components': t('Web Components', 'Web Components'),
	'core-components': t('Core Components', 'Core Components'),
	astro: t('Astro', 'Astro'),
	'core-foundations': t('Core Foundation', 'Core Foundation'),
};

const frameworkDescription = t(
	'Install the package, add the styles and check your setup.',
	'Installiere das Paket, binde die Styles ein und prüfe dein Setup.',
);

/**
 * All pages a learning package can contain: Learn pages and, until the Learn area is
 * reworked, the resources, releases, foundation and components pages. Keyed by id:
 * the EN path below /documentation/, plus # and the EN anchor for a section.
 */
export const packagePages: Record<string, PackagePage> = Object.fromEntries(
	[
		page(
			'resources/design',
			t('Design Resources', 'Design-Ressourcen'),
			t(
				'Get access to the Figma libraries and enable them in your file.',
				'Hole dir Zugang zu den Figma-Bibliotheken und aktiviere sie in deiner Datei.',
			),
		),
		page(
			'learn/figma-tutorial',
			t('Figma Tutorial', 'Figma-Tutorial'),
			t(
				'Design a contact form step by step, up to the handoff in Dev Mode.',
				'Gestalte Schritt für Schritt ein Kontaktformular, bis zur Übergabe im Dev Mode.',
			),
		),
		page(
			'learn/figma',
			t('Figma Tips', 'Figma-Tipps'),
			t(
				'Practical tips and workarounds for working in Figma.',
				'Praktische Tipps und Workarounds für die Arbeit in Figma.',
			),
		),
		page(
			'learn/plugins',
			t('Plugins & Tools', 'Plugins & Tools'),
			t(
				'Figma plugins and web tools for logos, custom colors and themes.',
				'Figma-Plugins und Web-Tools für Logos, eigene Farben und Themes.',
			),
		),
		page(
			'learn/about',
			t('About the Design System', 'Über das Design System'),
			t(
				'What the design system contains, how it is released and how binding it is.',
				'Was das Design System enthält, wie es veröffentlicht wird und wie verbindlich es ist.',
			),
		),
		page(
			'learn/about',
			t('Roadmap', 'Roadmap'),
			t('What the coming releases bring.', 'Was die kommenden Releases bringen.'),
			t('roadmap', 'roadmap'),
		),
		page(
			'learn/about',
			t('What a status means', 'Was ein Status bedeutet'),
			t(
				'Check which components are ready for production to estimate the effort.',
				'Prüfe, welche Komponenten produktionsreif sind, um den Aufwand abzuschätzen.',
			),
			t('what-a-status-means', 'was-ein-status-bedeutet'),
		),
		page(
			'learn/about',
			t('Where to ask which question', 'Wohin welche Frage gehört'),
			t(
				'Teams channels, consultation hour and issue trackers.',
				'Teams-Kanäle, Sprechstunde und Issue-Tracker.',
			),
			t('where-to-ask-which-question', 'wohin-welche-frage-gehört'),
		),
		page(
			'foundation',
			t('Foundation', 'Foundation'),
			t(
				'Colors, typography, spacing and the other tokens.',
				'Farben, Typografie, Abstände und die übrigen Tokens.',
			),
		),
		page(
			'components',
			t('Components', 'Komponenten'),
			t(
				'All components with guidelines, examples and their status.',
				'Alle Komponenten mit Richtlinien, Beispielen und ihrem Status.',
			),
		),
		page(
			'learn/migration',
			t('Migration from DB UI', 'Migration von DB UI'),
			t(
				'What changes in Figma when a Generation 2 file moves to Generation 3.',
				'Was sich in Figma ändert, wenn eine Datei von Generation 2 auf Generation 3 wechselt.',
			),
			t('design', 'design'),
		),
		page(
			'learn/migration',
			t('Migration from DB UI', 'Migration von DB UI'),
			t(
				'Replace packages, components, tokens and icons – an AI agent can do the groundwork.',
				'Ersetze Pakete, Komponenten, Tokens und Icons – ein KI-Agent kann die Vorarbeit übernehmen.',
			),
		),
		page(
			'learn/ai',
			t('Connect your AI coding agent', 'KI-Coding-Agenten verbinden'),
			t(
				'Give your AI coding agent access to components, tokens and examples.',
				'Gib deinem KI-Coding-Agenten Zugriff auf Komponenten, Tokens und Beispiele.',
			),
		),
		page(
			'learn/accessibility',
			t('Accessibility', 'Barrierefreiheit'),
			t(
				'What the components cover and what remains your responsibility.',
				'Was die Komponenten abdecken und was in deiner Verantwortung bleibt.',
			),
		),
		page(
			'learn/examples',
			t('Examples & Starters', 'Beispiele & Starter'),
			t(
				'Try the components in the browser and look at the example projects for every framework.',
				'Probiere die Komponenten im Browser aus und sieh dir die Beispielprojekte für jedes Framework an.',
			),
		),
		page(
			'learn/react-tutorial',
			t('React Tutorial', 'React-Tutorial'),
			t(
				'Build a contact form step by step, from an empty project to the production build.',
				'Baue Schritt für Schritt ein Kontaktformular, vom leeren Projekt bis zum Production Build.',
			),
		),
		page(
			'resources/packages/native',
			t('Native Platforms', 'Native Plattformen'),
			t(
				'The state of the native component libraries for iOS and Android.',
				'Der Stand der nativen Komponentenbibliotheken für iOS und Android.',
			),
		),
		page(
			'resources/packages/db-theme',
			t('Add the DB Theme', 'DB Theme ergänzen'),
			t(
				'Colors, fonts and icons of the Deutsche Bahn brand.',
				'Farben, Schriften und Icons der Marke Deutsche Bahn.',
			),
		),
		page(
			'releases/versioning',
			t('Versioning', 'Versionierung'),
			t(
				'How releases are versioned and announced.',
				'Wie Releases versioniert und angekündigt werden.',
			),
		),
		page(
			'releases/release-notes',
			t('Release Notes', 'Release Notes'),
			t('What changed in every version.', 'Was sich in jeder Version geändert hat.'),
		),
		// One setup guide per framework.
		...Object.entries(frameworkNames).map(([framework, name]) =>
			page(
				`resources/packages/${framework}`,
				t(`${name.en} guide`, `Anleitung für ${name.de}`),
				frameworkDescription,
			),
		),
	].map((item) => [item.id, item]),
);

const HELP = 'learn/about#where-to-ask-which-question';

/**
 * Resolves the ids to pages and appends "Where to ask which question" as the last
 * item. A package with the whole About page already contains that section.
 */
const withHelp = (ids: string[]): PackagePage[] =>
	(ids.includes('learn/about') ? ids : [...ids, HELP]).map((id) => packagePages[id]);

/** Link target of a page in the given language. */
export const toHref = (target: { path: string; anchor?: Text }, lang: Lang) => {
	const path = lang === 'de' ? `/de/${toDeSlug(target.path.replace(/^\//, ''))}` : target.path;
	return target.anchor ? `${path}#${target.anchor[lang]}` : path;
};

/** URL of the wizard start page in the given language. */
export const wizardHref = (lang: Lang) => toHref({ path: '/documentation/get-started' }, lang);

function frameworkResult(answers: Answers): Result {
	const framework = answers.framework ?? 'react';
	const name = frameworkNames[framework];
	const ids = [`resources/packages/${framework}`];
	if (answers.dbProduct === 'yes') ids.push('resources/packages/db-theme');
	// The tutorial starts with an empty project, so it only fits a new React project.
	if (framework === 'react' && answers.developmentIntent === 'new') {
		ids.push('learn/react-tutorial');
	}
	ids.push('learn/ai');
	return {
		title: t(`Set up ${name.en}`, `${name.de} einrichten`),
		description: frameworkDescription,
		cta: t(`${name.en} guide`, `Anleitung für ${name.de}`),
		items: withHelp(ids),
	};
}

/** Returns the next question for the given answers, or the result once the path is complete. */
export function next(answers: Answers): { question: Question } | { result: Result } {
	const ask = (id: QuestionId) => ({ question: questions[id] });
	const done = (title: Text, description: Text, cta: Text, ids: string[]) => ({
		result: { title, description, cta, items: withHelp(ids) },
	});

	switch (answers.role) {
		case undefined:
			return ask('role');

		case 'design':
			switch (answers.designIntent) {
				case undefined:
					return ask('designIntent');
				case 'new':
					return done(
						t('Your first Figma file', 'Deine erste Figma-Datei'),
						t(
							'Enable the libraries and design a first page with the components.',
							'Aktiviere die Bibliotheken und gestalte eine erste Seite mit den Komponenten.',
						),
						t('Go to the Design Resources', 'Zu den Design-Ressourcen'),
						['resources/design', 'learn/figma-tutorial'],
					);
				case 'learn':
					return done(
						t('About the Design System', 'Über das Design System'),
						t(
							'What the design system contains, how it is released and how binding it is.',
							'Was das Design System enthält, wie es veröffentlicht wird und wie verbindlich es ist.',
						),
						t('Read more', 'Mehr erfahren'),
						['learn/about', 'foundation', 'components'],
					);
				default:
					if (!answers.projectBasis) return ask('projectBasis');
					return answers.projectBasis === 'dbui'
						? done(
								t('Migration from DB UI', 'Migration von DB UI'),
								t(
									'What changes in Figma when a Generation 2 file moves to Generation 3.',
									'Was sich in Figma ändert, wenn eine Datei von Generation 2 auf Generation 3 wechselt.',
								),
								t('Go to the migration', 'Zur Migration'),
								['learn/migration#design', 'resources/design'],
							)
						: done(
								t('Move existing designs', 'Bestehende Designs umstellen'),
								t(
									'Enable the libraries and replace your components and styles step by step.',
									'Aktiviere die Bibliotheken und ersetze deine Komponenten und Styles nach und nach.',
								),
								t('Go to the Design Resources', 'Zu den Design-Ressourcen'),
								['resources/design', 'learn/figma', 'learn/plugins'],
							);
			}

		case 'development': {
			const intent = answers.developmentIntent;
			if (!intent) return ask('developmentIntent');
			if (intent === 'learn') {
				return done(
					t('Examples & Starters', 'Beispiele & Starter'),
					t(
						'Try the components in the browser and look at the example projects for every framework.',
						'Probiere die Komponenten im Browser aus und sieh dir die Beispielprojekte für jedes Framework an.',
					),
					t('Go to the examples', 'Zu den Beispielen'),
					['learn/examples', 'learn/about'],
				);
			}
			if (intent === 'existing') {
				if (!answers.projectBasis) return ask('projectBasis');
				if (answers.projectBasis === 'dbui') {
					return done(
						t('Migration from DB UI', 'Migration von DB UI'),
						t(
							'Replace packages, components, tokens and icons – an AI agent can do the groundwork.',
							'Ersetze Pakete, Komponenten, Tokens und Icons – ein KI-Agent kann die Vorarbeit übernehmen.',
						),
						t('Go to the migration', 'Zur Migration'),
						['learn/migration', 'learn/ai'],
					);
				}
			}
			if (!answers.framework) return ask('framework');
			if (answers.framework === 'native') {
				return done(
					t('Native Platforms', 'Native Plattformen'),
					t(
						'The state of the native component libraries for iOS and Android.',
						'Der Stand der nativen Komponentenbibliotheken für iOS und Android.',
					),
					t('Go to Native Platforms', 'Zu den nativen Plattformen'),
					['resources/packages/native'],
				);
			}
			if (!answers.dbProduct) return ask('dbProduct');
			return { result: frameworkResult(answers) };
		}

		case 'product':
			switch (answers.productIntent) {
				case undefined:
					return ask('productIntent');
				case 'evaluate':
					return done(
						t('About the Design System', 'Über das Design System'),
						t(
							'What it contains, what a status means, how binding it is and what it covers for accessibility.',
							'Was es enthält, was ein Status bedeutet, wie verbindlich es ist und was es bei der Barrierefreiheit abdeckt.',
						),
						t('Read more', 'Mehr erfahren'),
						['learn/about', 'learn/accessibility'],
					);
				case 'plan':
					return done(
						t('Versioning', 'Versionierung'),
						t(
							'How releases are versioned and announced, so you can plan updates in your product.',
							'Wie Releases versioniert und angekündigt werden, damit du Updates in deinem Produkt planen kannst.',
						),
						t('Go to versioning', 'Zur Versionierung'),
						['releases/versioning', 'releases/release-notes'],
					);
				case 'follow':
					return done(
						t('Release Notes', 'Release Notes'),
						t(
							'Release notes for every version and the roadmap of the coming releases.',
							'Release Notes zu jeder Version und die Roadmap der kommenden Releases.',
						),
						t('Go to the release notes', 'Zu den Release Notes'),
						['releases/release-notes', 'learn/about#roadmap'],
					);
				default:
					if (!answers.productBasis) return ask('productBasis');
					return answers.productBasis === 'dbui'
						? done(
								t('Migration from DB UI', 'Migration von DB UI'),
								t(
									'What changes for design and development when a Generation 2 product moves to Generation 3.',
									'Was sich für Design und Entwicklung ändert, wenn ein Produkt von Generation 2 auf Generation 3 wechselt.',
								),
								t('Go to the migration', 'Zur Migration'),
								['learn/migration', 'releases/versioning'],
							)
						: done(
								t('What a status means', 'Was ein Status bedeutet'),
								t(
									'Check which components are ready for production to estimate the effort.',
									'Prüfe, welche Komponenten produktionsreif sind, um den Aufwand abzuschätzen.',
								),
								t('Check the status', 'Status prüfen'),
								['learn/about#what-a-status-means', 'components'],
							);
			}

		default:
			return ask('role');
	}
}

/** Question ids in the order they were asked for the given answers. */
export function askedQuestions(answers: Answers): QuestionId[] {
	const asked: QuestionId[] = [];
	const partial: Answers = {};
	for (;;) {
		const step = next(partial);
		if (!('question' in step)) return asked;
		const id = step.question.id;
		if (!answers[id]) return asked;
		asked.push(id);
		partial[id] = answers[id];
	}
}
