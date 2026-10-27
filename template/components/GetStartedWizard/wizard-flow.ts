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
	items: PackagePage[];
};

export type Answers = Partial<Record<QuestionId, string>>;

const t = (en: string, de: string): Text => ({ en, de });

const intentOptions = (newText: Text, existingText: Text, learnText: Text): Option[] => [
	// Actions, not objects: the question asks what the user is about to do.
	{ id: 'new', label: t('Start a new project', 'Neues Projekt starten'), description: newText },
	{
		id: 'existing',
		label: t('Move an existing project', 'Bestehendes Projekt umstellen'),
		description: existingText,
	},
	{
		id: 'learn',
		label: t('Explore the design system', 'Design System kennenlernen'),
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
				// Soft hyphen (U+00AD): the only option label that is a single long word.
				// In the three-column layout it does not fit on one line, and without a
				// break opportunity the browser splits it anywhere ("Produktmanager:i|n").
				// Screen readers ignore the character; it only marks where to hyphenate.
				label: t('Product manager', 'Produkt\u00ADmanager:in'),
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
				'Replace your components and styles with those of the design system.',
				'Ersetze deine Komponenten und Styles durch die des Design Systems.',
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
				'Replace your components and styles with the packages of the design system.',
				'Ersetze deine Komponenten und Styles durch die Pakete des Design Systems.',
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
				label: t('Evaluate the design system', 'Design System bewerten'),
				description: t(
					'Find out what it contains, what a status means and how binding it is.',
					'Erfahre, was es enthält, was ein Status bedeutet und wie verbindlich es ist.',
				),
			},
			{
				id: 'plan',
				label: t('Plan the adoption', 'Einführung planen'),
				description: t(
					'Estimate which components are ready for production and how often updates come.',
					'Schätze ab, welche Komponenten produktionsreif sind und wie oft Updates kommen.',
				),
			},
			{
				id: 'existing',
				label: t('Move an existing product', 'Bestehendes Produkt umstellen'),
				description: t(
					'Find out what changes when your product moves onto the design system.',
					'Erfahre, was sich ändert, wenn dein Produkt auf das Design System wechselt.',
				),
			},
			{
				id: 'follow',
				label: t('Follow updates', 'Updates verfolgen'),
				description: t(
					'Release notes and the announcement channels.',
					'Release Notes und die Kanäle für Ankündigungen.',
				),
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

/**
 * The setup article in the Learn area per framework option. The id is the page id
 * below /documentation/, the title is the label of the page in the result.
 */
const frameworkSetups: Record<string, { id: string; title: Text }> = {
	react: {
		id: 'learn/react-setup',
		title: t('Add the components to React', 'Komponenten in React einbinden'),
	},
	angular: {
		id: 'learn/angular-setup',
		title: t('Add the components to Angular', 'Komponenten in Angular einbinden'),
	},
	vue: {
		id: 'learn/vue-setup',
		title: t('Add the components to Vue', 'Komponenten in Vue einbinden'),
	},
	'web-components': {
		id: 'learn/web-components-setup',
		title: t('Use the components as Web Components', 'Komponenten als Web Components nutzen'),
	},
	'core-components': {
		id: 'learn/html-css-setup',
		title: t('Use the components with HTML and CSS', 'Komponenten mit HTML und CSS nutzen'),
	},
	astro: {
		id: 'learn/astro-setup',
		title: t('Add the components to Astro', 'Komponenten in Astro einbinden'),
	},
	'core-foundations': {
		id: 'learn/foundation-setup',
		title: t('Use the tokens without components', 'Tokens ohne Komponenten nutzen'),
	},
};

const frameworkDescription = t(
	'Install the packages, load the styles and check your setup.',
	'Installiere die Pakete, lade die Styles und prüfe dein Setup.',
);

/**
 * All pages a learning package can contain: mostly Learn articles, plus the
 * releases, foundation, components and native pages for reference. Keyed by id:
 * the EN path below /documentation/, plus # and the EN anchor for a section.
 */
export const packagePages: Record<string, PackagePage> = Object.fromEntries(
	[
		page(
			'learn/figma-setup',
			t('Set up the Figma libraries', 'Figma-Bibliotheken einrichten'),
			t(
				'Get access to the Figma libraries and enable them in your file.',
				'Hole dir Zugang zu den Figma-Bibliotheken und aktiviere sie in deiner Datei.',
			),
		),
		page(
			'learn/figma-tutorial',
			t('Design a contact form in Figma', 'Ein Kontaktformular in Figma gestalten'),
			t(
				'Design a contact form step by step, up to the handoff in Dev Mode.',
				'Gestalte Schritt für Schritt ein Kontaktformular, bis zur Übergabe im Dev Mode.',
			),
		),
		page(
			'learn/figma',
			t('Work with the components in Figma', 'Mit den Komponenten in Figma arbeiten'),
			t(
				'Practical tips and workarounds for working in Figma.',
				'Praktische Tipps und Workarounds für die Arbeit in Figma.',
			),
		),
		page(
			'learn/plugins',
			t('Add logos and custom colors in Figma', 'Logos und eigene Farben in Figma ergänzen'),
			t(
				'Figma plugins and web tools for logos, custom colors and themes.',
				'Figma-Plugins und Web-Tools für Logos, eigene Farben und Themes.',
			),
		),
		page(
			'learn/about',
			t('What the design system is', 'Was das Design System ist'),
			t(
				'What the design system contains, what a status means and how binding it is.',
				'Was das Design System enthält, was ein Status bedeutet und wie verbindlich es ist.',
			),
		),
		page(
			'learn/status',
			t('What a status means', 'Was ein Status bedeutet'),
			t(
				'Check which components are ready for production to estimate the effort.',
				'Prüfe, welche Komponenten produktionsreif sind, um den Aufwand abzuschätzen.',
			),
		),
		page(
			'learn/about',
			t('Where to get help', 'Wo du Hilfe bekommst'),
			t(
				'Issue trackers, Teams channels, consultation hour and email.',
				'Issue-Tracker, Teams-Kanäle, Sprechstunde und E-Mail.',
			),
			t('where-to-get-help', 'wo-du-hilfe-bekommst'),
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
			t('Move from DB UI to Generation 3', 'Von DB UI auf Generation 3 wechseln'),
			t(
				'What changes in Figma when a Generation 2 file moves to Generation 3.',
				'Was sich in Figma ändert, wenn eine Datei von Generation 2 auf Generation 3 wechselt.',
			),
			t('design', 'design'),
		),
		page(
			'learn/migration',
			t('Move from DB UI to Generation 3', 'Von DB UI auf Generation 3 wechseln'),
			t(
				'Replace packages, components, tokens and icons – an AI agent can do the groundwork.',
				'Ersetze Pakete, Komponenten, Tokens und Icons – ein KI-Agent kann die Vorarbeit übernehmen.',
			),
		),
		page(
			'learn/ai',
			t('Work with AI coding agents', 'Mit KI-Coding-Agenten arbeiten'),
			t(
				'Give your AI coding agent access to components, tokens and examples.',
				'Gib deinem KI-Coding-Agenten Zugriff auf Komponenten, Tokens und Beispiele.',
			),
		),
		page(
			'learn/accessibility',
			t('Build accessible products', 'Barrierefreie Produkte bauen'),
			t(
				'What the components cover and what remains your responsibility.',
				'Was die Komponenten abdecken und was in deiner Verantwortung bleibt.',
			),
		),
		page(
			'learn/examples',
			t('Start from an example project', 'Mit einem Beispielprojekt starten'),
			t(
				'Try the components in the browser and look at the example projects for every framework.',
				'Probiere die Komponenten im Browser aus und sieh dir die Beispielprojekte für jedes Framework an.',
			),
		),
		page(
			'learn/react-tutorial',
			t('Build a contact form in React', 'Ein Kontaktformular in React bauen'),
			t(
				'Build a contact form step by step, up to the production build.',
				'Baue Schritt für Schritt ein Kontaktformular, bis zum Production Build.',
			),
		),
		page(
			'learn/about',
			t('Native platforms', 'Native Plattformen'),
			t(
				'The state of the native component libraries for iOS and Android.',
				'Der Stand der nativen Komponentenbibliotheken für iOS und Android.',
			),
			t('native-platforms', 'native-plattformen'),
		),
		page(
			'learn/db-theme-setup',
			t('Add the DB Theme for DB products', 'DB Theme für DB-Produkte ergänzen'),
			t(
				'Colors, fonts and icons of the Deutsche Bahn brand.',
				'Farben, Schriften und Icons der Marke Deutsche Bahn.',
			),
		),
		page(
			'learn/versioning',
			t('How releases work', 'Wie Releases funktionieren'),
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
		// One setup article per framework.
		...Object.values(frameworkSetups).map(({ id, title }) => page(id, title, frameworkDescription)),
	].map((item) => [item.id, item]),
);

const HELP = 'learn/about#where-to-get-help';

/**
 * Resolves the ids to pages and appends "Where to get help" as the last item. A
 * package with the whole About page already contains that section.
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
	const setup = frameworkSetups[answers.framework ?? 'react'] ?? frameworkSetups.react;
	const ids = [setup.id];
	// Only what a developer needs to start: the setup (it also offers a starter project
	// where one exists), the brand for DB products and the AI agent.
	if (answers.dbProduct === 'yes') ids.push('learn/db-theme-setup');
	ids.push('learn/ai');
	return { items: withHelp(ids) };
}

/** Returns the next question for the given answers, or the result once the path is complete. */
export function next(answers: Answers): { question: Question } | { result: Result } {
	const ask = (id: QuestionId) => ({ question: questions[id] });
	const done = (ids: string[]) => ({ result: { items: withHelp(ids) } });

	switch (answers.role) {
		case undefined:
			return ask('role');

		case 'design':
			switch (answers.designIntent) {
				case undefined:
					return ask('designIntent');
				case 'new':
					return done(['learn/figma-setup', 'learn/figma-tutorial']);
				case 'learn':
					return done(['learn/about', 'foundation', 'components']);
				default:
					if (!answers.projectBasis) return ask('projectBasis');
					return answers.projectBasis === 'dbui'
						? done(['learn/migration#design', 'learn/figma-setup'])
						: done(['learn/figma-setup', 'learn/figma', 'learn/plugins']);
			}

		case 'development': {
			const intent = answers.developmentIntent;
			if (!intent) return ask('developmentIntent');
			if (intent === 'learn') {
				return done(['learn/examples', 'learn/about']);
			}
			if (intent === 'existing') {
				if (!answers.projectBasis) return ask('projectBasis');
				if (answers.projectBasis === 'dbui') {
					return done(['learn/migration', 'learn/ai']);
				}
			}
			if (!answers.framework) return ask('framework');
			if (answers.framework === 'native') {
				return done(['learn/about#native-platforms']);
			}
			if (!answers.dbProduct) return ask('dbProduct');
			return { result: frameworkResult(answers) };
		}

		case 'product':
			switch (answers.productIntent) {
				case undefined:
					return ask('productIntent');
				case 'evaluate':
					return done(['learn/about', 'learn/accessibility']);
				case 'plan':
					return done(['learn/versioning', 'releases/release-notes']);
				case 'follow':
					return done(
						// The EN About page has no roadmap section anymore; every release note
						// links to the roadmap of its version.
						['releases/release-notes'],
					);
				default:
					if (!answers.productBasis) return ask('productBasis');
					return answers.productBasis === 'dbui'
						? done(['learn/migration', 'learn/versioning'])
						: done(['learn/status', 'components']);
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
