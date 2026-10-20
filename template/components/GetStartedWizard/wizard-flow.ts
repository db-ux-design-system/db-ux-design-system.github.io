/**
 * Decision tree of the Get Started wizard.
 *
 * Every path ends on an existing documentation page. When a destination page moves,
 * update its path here. Paths are EN content paths; the component turns
 * them into DE URLs with toDeSlug. Anchors differ per language, so they are part of
 * the localized text.
 */

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
	/** DB Theme icon name, only shown in the tile layout. */
	icon?: string;
};

export type Question = {
	id: QuestionId;
	title: Text;
	/** Tiles for few answers with icons, list for everything else. */
	layout: 'tiles' | 'list';
	options: Option[];
};

export type Link = { label: Text; path: string; anchor?: Text; description?: Text };

export type Result = {
	title: Text;
	description: Text;
	primary: Link;
	more: Link[];
};

export type Answers = Partial<Record<QuestionId, string>>;

const t = (en: string, de: string): Text => ({ en, de });

const link = (en: string, de: string, path: string, anchor?: Text): Link => ({
	label: t(en, de),
	path,
	anchor,
});

const intentOptions = (newText: Text, existingText: Text, learnText: Text): Option[] => [
	{ id: 'new', label: t('Start a new project', 'Neues Projekt starten'), description: newText },
	{
		id: 'existing',
		label: t('Rebuild an existing project', 'Bestehendes Projekt umbauen'),
		description: existingText,
	},
	{
		id: 'learn',
		label: t('Get to know the design system', 'Das Design System kennenlernen'),
		description: learnText,
	},
];

const basisOptions: Option[] = [
	{
		id: 'dbui',
		label: t('DB UI (Generation 2)', 'DB UI (Generation 2)'),
		description: t(
			'The previous generation of the design system.',
			'Die vorherige Generation des Design Systems.',
		),
	},
	{
		id: 'other',
		label: t('Something else', 'Eine andere Grundlage'),
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
		layout: 'tiles',
		options: [
			{
				id: 'design',
				icon: 'pen',
				label: t('I design interfaces in Figma.', 'Ich gestalte Interfaces in Figma.'),
			},
			{
				id: 'development',
				icon: 'laptop',
				label: t('I build interfaces in code.', 'Ich baue Interfaces im Code.'),
			},
			{
				id: 'product',
				icon: 'compass',
				label: t(
					'I decide on, plan or steer the use of the design system.',
					'Ich entscheide über den Einsatz des Design Systems, plane oder steuere ihn.',
				),
			},
		],
	},
	designIntent: {
		id: 'designIntent',
		title: t('What are you about to do?', 'Was hast du vor?'),
		layout: 'list',
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
		layout: 'list',
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
		layout: 'list',
		options: [
			{
				id: 'evaluate',
				label: t('Evaluate the design system', 'Das Design System bewerten'),
				description: t(
					'What it contains, what a status means and how binding it is.',
					'Was es enthält, was ein Status bedeutet und wie verbindlich es ist.',
				),
			},
			{
				id: 'plan',
				label: t('Plan the introduction', 'Die Einführung planen'),
				description: t(
					'How releases are versioned and announced.',
					'Wie Releases versioniert und angekündigt werden.',
				),
			},
			{
				id: 'existing',
				label: t('Move an existing product', 'Bestehendes Produkt umstellen'),
				description: t(
					'What changes when a product moves onto the design system.',
					'Was sich ändert, wenn ein Produkt auf das Design System wechselt.',
				),
			},
			{
				id: 'follow',
				label: t('Follow the development', 'Die Entwicklung verfolgen'),
				description: t('Release notes and the roadmap.', 'Release Notes und die Roadmap.'),
			},
		],
	},
	projectBasis: {
		id: 'projectBasis',
		title: t('What is your project based on?', 'Worauf basiert dein Projekt?'),
		layout: 'list',
		options: basisOptions,
	},
	productBasis: {
		id: 'productBasis',
		title: t('What is your product based on?', 'Worauf basiert dein Produkt?'),
		layout: 'list',
		options: basisOptions,
	},
	framework: {
		id: 'framework',
		title: t('Which framework do you use?', 'Welches Framework nutzt du?'),
		layout: 'list',
		options: [
			{ id: 'react', label: t('React', 'React') },
			{ id: 'angular', label: t('Angular', 'Angular') },
			{ id: 'vue', label: t('Vue', 'Vue') },
			{ id: 'web-components', label: t('Web Components', 'Web Components') },
			{ id: 'core-components', label: t('HTML and CSS', 'HTML und CSS') },
			{ id: 'astro', label: t('Astro', 'Astro') },
			{
				id: 'core-foundations',
				label: t('Own components', 'Eigene Komponenten'),
				description: t('Only the tokens and base styles.', 'Nur die Tokens und Basis-Styles.'),
			},
			{ id: 'native', label: t('iOS or Android', 'iOS oder Android') },
		],
	},
	dbProduct: {
		id: 'dbProduct',
		title: t(
			'Do you build a product of Deutsche Bahn?',
			'Baust du ein Produkt der Deutschen Bahn?',
		),
		layout: 'list',
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

const RESOURCES = '/documentation/resources';
const LEARN = '/documentation/learn';

const help = link(
	'Where to ask which question',
	'Wohin welche Frage gehört',
	`${LEARN}/about`,
	t('where-to-ask-which-question', 'wohin-welche-frage-gehört'),
);

const linkKey = (item: Link) => item.path + (item.anchor ? `#${item.anchor.en}` : '');

/** Short descriptions for the "Also helpful" cards, keyed by path and EN anchor. */
const moreDescriptions: Record<string, Text> = {
	[`${LEARN}/figma-tutorial`]: t(
		'Design a contact form step by step, up to the handoff in Dev Mode.',
		'Gestalte Schritt für Schritt ein Kontaktformular, bis zur Übergabe im Dev Mode.',
	),
	[`${LEARN}/react-tutorial`]: t(
		'Build a contact form step by step, from an empty project to the production build.',
		'Baue Schritt für Schritt ein Kontaktformular, vom leeren Projekt bis zum Production Build.',
	),
	[`${LEARN}/figma`]: t(
		'Practical tips and workarounds for working in Figma.',
		'Praktische Tipps und Workarounds für die Arbeit in Figma.',
	),
	[`${LEARN}/plugins`]: t(
		'Figma plugins and web tools for logos, custom colors and themes.',
		'Figma-Plugins und Web-Tools für Logos, eigene Farben und Themes.',
	),
	[`${LEARN}/about`]: t(
		'What the design system contains, how it is released and how binding it is.',
		'Was das Design System enthält, wie es veröffentlicht wird und wie verbindlich es ist.',
	),
	[`${LEARN}/about#roadmap`]: t(
		'What the coming releases bring.',
		'Was die kommenden Releases bringen.',
	),
	[`${LEARN}/about#where-to-ask-which-question`]: t(
		'Teams channels, consultation hour and issue trackers.',
		'Teams-Kanäle, Sprechstunde und Issue-Tracker.',
	),
	[`${LEARN}/ai`]: t(
		'Give your AI coding agent access to components, tokens and examples.',
		'Gib deinem KI-Coding-Agenten Zugriff auf Komponenten, Tokens und Beispiele.',
	),
	[`${LEARN}/accessibility`]: t(
		'What the components cover and what remains your responsibility.',
		'Was die Komponenten abdecken und was in deiner Verantwortung bleibt.',
	),
	[`${RESOURCES}/design`]: t(
		'Get access to the Figma libraries and enable them in your file.',
		'Hole dir Zugang zu den Figma-Bibliotheken und aktiviere sie in deiner Datei.',
	),
	[`${RESOURCES}/packages/db-theme`]: t(
		'Colors, fonts and icons of the Deutsche Bahn brand.',
		'Farben, Schriften und Icons der Marke Deutsche Bahn.',
	),
	'/documentation/foundation': t(
		'Colors, typography, spacing and the other tokens.',
		'Farben, Typografie, Abstände und die übrigen Tokens.',
	),
	'/documentation/components': t(
		'All components with guidelines, examples and their status.',
		'Alle Komponenten mit Richtlinien, Beispielen und ihrem Status.',
	),
	'/documentation/releases/versioning': t(
		'How releases are versioned and announced.',
		'Wie Releases versioniert und angekündigt werden.',
	),
	'/documentation/releases/release-notes': t(
		'What changed in every version.',
		'Was sich in jeder Version geändert hat.',
	),
};

const frameworkNames: Record<string, Text> = {
	react: t('React', 'React'),
	angular: t('Angular', 'Angular'),
	vue: t('Vue', 'Vue'),
	'web-components': t('Web Components', 'Web Components'),
	'core-components': t('Core Components', 'Core Components'),
	astro: t('Astro', 'Astro'),
	'core-foundations': t('Core Foundation', 'Core Foundation'),
};

function frameworkResult(answers: Answers): Result {
	const framework = answers.framework ?? 'react';
	const name = frameworkNames[framework];
	const more: Link[] = [];
	if (answers.dbProduct === 'yes') {
		more.push(link('Add the DB Theme', 'DB Theme ergänzen', `${RESOURCES}/packages/db-theme`));
	}
	if (framework === 'react' && answers.developmentIntent === 'new') {
		more.push(link('React Tutorial', 'React-Tutorial', `${LEARN}/react-tutorial`));
	}
	more.push(link('Connect your AI coding agent', 'KI-Coding-Agenten verbinden', `${LEARN}/ai`));
	return {
		title: t(`Set up ${name.en}`, `${name.de} einrichten`),
		description: t(
			'Install the package, add the styles and check your setup.',
			'Installiere das Paket, binde die Styles ein und prüfe dein Setup.',
		),
		primary: link(
			`${name.en} guide`,
			`Anleitung für ${name.de}`,
			`${RESOURCES}/packages/${framework}`,
		),
		more,
	};
}

/** Returns the next question for the given answers, or the result once the path is complete. */
export function next(answers: Answers): { question: Question } | { result: Result } {
	const ask = (id: QuestionId) => ({ question: questions[id] });
	const done = (result: Result) => ({
		result: {
			...result,
			more: [...result.more, help].map((item) => ({
				...item,
				description: moreDescriptions[linkKey(item)],
			})),
		},
	});

	switch (answers.role) {
		case undefined:
			return ask('role');

		case 'design':
			switch (answers.designIntent) {
				case undefined:
					return ask('designIntent');
				case 'new':
					return done({
						title: t('Design Resources', 'Design-Ressourcen'),
						description: t(
							'Get access to the Figma libraries and enable them in your file.',
							'Hole dir Zugang zu den Figma-Bibliotheken und aktiviere sie in deiner Datei.',
						),
						primary: link(
							'Go to the Design Resources',
							'Zu den Design-Ressourcen',
							`${RESOURCES}/design`,
						),
						more: [link('Figma Tutorial', 'Figma-Tutorial', `${LEARN}/figma-tutorial`)],
					});
				case 'learn':
					return done({
						title: t('About the Design System', 'Über das Design System'),
						description: t(
							'What the design system contains, how it is released and how binding it is.',
							'Was das Design System enthält, wie es veröffentlicht wird und wie verbindlich es ist.',
						),
						primary: link('Read more', 'Mehr erfahren', `${LEARN}/about`),
						more: [
							link('Foundation', 'Foundation', '/documentation/foundation'),
							link('Components', 'Komponenten', '/documentation/components'),
						],
					});
				default:
					if (!answers.projectBasis) return ask('projectBasis');
					return answers.projectBasis === 'dbui'
						? done({
								title: t('Migration from DB UI', 'Migration von DB UI'),
								description: t(
									'What changes in Figma when a Generation 2 file moves to Generation 3.',
									'Was sich in Figma ändert, wenn eine Datei von Generation 2 auf Generation 3 wechselt.',
								),
								primary: link(
									'Go to the migration',
									'Zur Migration',
									`${LEARN}/migration`,
									t('design', 'design'),
								),
								more: [link('Design Resources', 'Design-Ressourcen', `${RESOURCES}/design`)],
							})
						: done({
								title: t('Design Resources', 'Design-Ressourcen'),
								description: t(
									'Enable the libraries and replace your components and styles step by step.',
									'Aktiviere die Bibliotheken und ersetze deine Komponenten und Styles nach und nach.',
								),
								primary: link(
									'Go to the Design Resources',
									'Zu den Design-Ressourcen',
									`${RESOURCES}/design`,
								),
								more: [
									link('Figma Tips', 'Figma-Tipps', `${LEARN}/figma`),
									link('Plugins & Tools', 'Plugins & Tools', `${LEARN}/plugins`),
								],
							});
			}

		case 'development': {
			const intent = answers.developmentIntent;
			if (!intent) return ask('developmentIntent');
			if (intent === 'learn') {
				return done({
					title: t('Examples & Starters', 'Beispiele & Starter'),
					description: t(
						'Try the components in the browser and look at the example projects for every framework.',
						'Probiere die Komponenten im Browser aus und sieh dir die Beispielprojekte für jedes Framework an.',
					),
					primary: link('Go to the examples', 'Zu den Beispielen', `${LEARN}/examples`),
					more: [link('About the Design System', 'Über das Design System', `${LEARN}/about`)],
				});
			}
			if (intent === 'existing') {
				if (!answers.projectBasis) return ask('projectBasis');
				if (answers.projectBasis === 'dbui') {
					return done({
						title: t('Migration from DB UI', 'Migration von DB UI'),
						description: t(
							'Replace packages, components, tokens and icons – an AI agent can do the groundwork.',
							'Ersetze Pakete, Komponenten, Tokens und Icons – ein KI-Agent kann die Vorarbeit übernehmen.',
						),
						primary: link('Go to the migration', 'Zur Migration', `${LEARN}/migration`),
						more: [
							link('Connect your AI coding agent', 'KI-Coding-Agenten verbinden', `${LEARN}/ai`),
						],
					});
				}
			}
			if (!answers.framework) return ask('framework');
			if (answers.framework === 'native') {
				return done({
					title: t('Native Platforms', 'Native Plattformen'),
					description: t(
						'The state of the native component libraries for iOS and Android.',
						'Der Stand der nativen Komponentenbibliotheken für iOS und Android.',
					),
					primary: link(
						'Go to Native Platforms',
						'Zu den nativen Plattformen',
						`${RESOURCES}/packages/native`,
					),
					more: [],
				});
			}
			if (!answers.dbProduct) return ask('dbProduct');
			return done(frameworkResult(answers));
		}

		case 'product':
			switch (answers.productIntent) {
				case undefined:
					return ask('productIntent');
				case 'evaluate':
					return done({
						title: t('About the Design System', 'Über das Design System'),
						description: t(
							'What it contains, what a status means, how binding it is and what it covers for accessibility.',
							'Was es enthält, was ein Status bedeutet, wie verbindlich es ist und was es bei der Barrierefreiheit abdeckt.',
						),
						primary: link('Read more', 'Mehr erfahren', `${LEARN}/about`),
						more: [link('Accessibility', 'Barrierefreiheit', `${LEARN}/accessibility`)],
					});
				case 'plan':
					return done({
						title: t('Versioning', 'Versionierung'),
						description: t(
							'How releases are versioned and announced, so you can plan updates in your product.',
							'Wie Releases versioniert und angekündigt werden, damit du Updates in deinem Produkt planen kannst.',
						),
						primary: link(
							'Go to versioning',
							'Zur Versionierung',
							'/documentation/releases/versioning',
						),
						more: [link('Release Notes', 'Release Notes', '/documentation/releases/release-notes')],
					});
				case 'follow':
					return done({
						title: t('Release Notes', 'Release Notes'),
						description: t(
							'Release notes for every version and the roadmap of the coming releases.',
							'Release Notes zu jeder Version und die Roadmap der kommenden Releases.',
						),
						primary: link(
							'Go to the release notes',
							'Zu den Release Notes',
							'/documentation/releases/release-notes',
						),
						more: [link('Roadmap', 'Roadmap', `${LEARN}/about`, t('roadmap', 'roadmap'))],
					});
				default:
					if (!answers.productBasis) return ask('productBasis');
					return answers.productBasis === 'dbui'
						? done({
								title: t('Migration from DB UI', 'Migration von DB UI'),
								description: t(
									'What changes for design and development when a Generation 2 product moves to Generation 3.',
									'Was sich für Design und Entwicklung ändert, wenn ein Produkt von Generation 2 auf Generation 3 wechselt.',
								),
								primary: link('Go to the migration', 'Zur Migration', `${LEARN}/migration`),
								more: [link('Versioning', 'Versionierung', '/documentation/releases/versioning')],
							})
						: done({
								title: t('What a status means', 'Was ein Status bedeutet'),
								description: t(
									'Check which components are ready for production to estimate the effort.',
									'Prüfe, welche Komponenten produktionsreif sind, um den Aufwand abzuschätzen.',
								),
								primary: link(
									'Check the status',
									'Status prüfen',
									`${LEARN}/about`,
									t('what-a-status-means', 'was-ein-status-bedeutet'),
								),
								more: [link('Components', 'Komponenten', '/documentation/components')],
							});
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
