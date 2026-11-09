const en = {
	title: 'Theme Builder preview',
	contribution: {
		title: 'Contribution history',
		subtitle: 'Last 7 months of activity',
		chartLabel: 'Bar chart with contributions per month',
		months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
		stats: [
			{ label: 'Upcoming', value: 'May 25', meta: '$1,000 scheduled' },
			{ label: 'Auto-save plan', value: 'Accelerated', meta: 'Recurring weekly' },
		],
		cta: 'View full report',
	},
	payout: {
		title: 'Payout threshold',
		subtitle: 'Set the minimum balance required before a payout is triggered.',
		currency: 'Preferred currency',
		currencies: ['USD – US Dollar', 'EUR – Euro', 'GBP – British Pound'],
		amount: 'Minimum payout amount',
		notes: 'Notes',
		notesPlaceholder: 'Add any notes for this payout configuration',
		cta: 'Save threshold',
	},
	savings: {
		title: 'Savings targets',
		subtitle: 'Active milestones for this year',
		newGoal: 'New goal',
		goals: [
			{ label: 'Retirement', value: '$420,000', target: '$273,000', progress: 65 },
			{ label: 'Real estate', value: '$85,000', target: '$27,200', progress: 32 },
		],
		achieved: 'achieved',
		note: 'You have not met your targets for this year.',
	},
	empty: {
		title: 'Create your first project',
		text: 'Projects keep files, tasks and people in one place.',
		cta: 'New project',
	},
	balance: {
		title: 'Claimable balance',
		value: '$0.00',
		status: 'Pending setup',
		rows: [
			{ label: 'Net royalties', value: '$0.00' },
			{ label: 'Processing fee', value: '−$0.00' },
			{ label: 'Total ready to claim', value: '$0.00' },
		],
		note: 'Once your bank is connected, balances are paid out monthly.',
	},
	transactions: {
		title: 'Recent transactions',
		subtitle: 'Your latest account activity',
		items: [
			{ icon: 'check_circle', title: 'Corner Market', meta: 'Groceries', value: '−$48.20' },
			// Only icons of the white label set (@db-ux/core-foundations ALL_ICONS) render with Lucide
			{ icon: 'arrow_up', title: 'Monthly rent', meta: 'Housing', value: '−$1,250.00' },
			{ icon: 'clock', title: 'Streaming service', meta: 'Subscription', value: '−$12.99' },
			{ icon: 'arrow_down', title: 'Savings transfer', meta: 'Income', value: '+$500.00' },
		],
	},
	notifications: {
		title: 'Notifications',
		subtitle: 'Choose what you want to hear about.',
		items: ['Product updates', 'Weekly summary', 'Marketing emails'],
	},
	promo: {
		title: 'Upgrade to Pro',
		text: 'This module sits in a brand color context. Every component inside follows data-color automatically.',
		cta: 'Upgrade',
		secondary: 'Not now',
	},
	signIn: {
		title: 'Sign in',
		subtitle: 'Enter your email to access your account.',
		email: 'Email',
		password: 'Password',
		remember: 'Remember me',
		cta: 'Sign in',
		forgot: 'Forgot password?',
	},
	plan: {
		title: 'Choose a plan',
		options: [
			{ label: 'Monthly', meta: '$12 / month' },
			{ label: 'Yearly', meta: '$120 / year' },
		],
		addon: 'Add priority support',
		cta: 'Continue',
	},
	faq: {
		title: 'Frequently asked',
		items: [
			{
				question: 'What does white label mean?',
				answer:
					'The same components and tokens carry a different brand. Colors, shapes and typography change, the structure stays.',
			},
			{
				question: 'Which values are generated?',
				answer:
					'Each color gets 15 palette steps plus origin, hover and pressed states. All semantic tokens are derived from them.',
			},
			{
				question: 'Is the result accessible?',
				answer:
					'Each palette step has the same luminance across all hues, so contrast ratios stay predictable.',
			},
		],
	},
	typography: {
		eyebrow: 'Guide',
		title: 'Designing with one system for many brands',
		lead: 'A white label design system separates structure from brand expression. Components stay the same, tokens carry the identity.',
		p1: 'Every theme starts with a few decisions: an <strong>origin color</strong>, a neutral tone, the shape of corners and the typefaces. The <a href="/themebuilder?view=palettes" target="_top">color generator</a> turns each origin color into a complete palette.',
		h2: 'From one color to a full palette',
		p2: 'The generator works in HSLuv. Its lightness equals CIELUV L*, which depends on luminance only. Colors on the same step therefore have the same contrast against white and black, whatever their hue.',
		list: [
			'<strong>15 steps</strong> from dark to light form the contrast ladder.',
			'<strong>Origin states</strong> for hover and pressed shift only the lightness.',
			'<strong>On-origin</strong> uses the end of the ramp with the higher contrast.',
		],
		quote: 'Consistency is not uniformity. One system, many identities.',
		h3: 'Applying the theme',
		p3: 'Export the generated CSS and load it after the DB theme. The semantic tokens of the core components pick up the new values automatically.',
		h4: 'Heading level 4',
		p4: 'Body text uses the selected body font. Headings use the heading font.',
	},
	showMore: 'Show more',
};

export type PreviewTexts = typeof en;

const de: PreviewTexts = {
	title: 'Theme Builder Vorschau',
	contribution: {
		title: 'Einzahlungsverlauf',
		subtitle: 'Aktivität der letzten 7 Monate',
		chartLabel: 'Balkendiagramm mit Einzahlungen pro Monat',
		months: ['Nov.', 'Dez.', 'Jan.', 'Feb.', 'März', 'Apr.', 'Mai'],
		stats: [
			{ label: 'Demnächst', value: '25. Mai', meta: '1.000 € geplant' },
			{ label: 'Sparplan', value: 'Beschleunigt', meta: 'Wöchentlich' },
		],
		cta: 'Vollständigen Bericht ansehen',
	},
	payout: {
		title: 'Auszahlungsgrenze',
		subtitle: 'Lege den Mindestbetrag fest, ab dem eine Auszahlung erfolgt.',
		currency: 'Bevorzugte Währung',
		currencies: ['EUR – Euro', 'USD – US-Dollar', 'GBP – Britisches Pfund'],
		amount: 'Mindestbetrag für Auszahlung',
		notes: 'Notizen',
		notesPlaceholder: 'Notizen zu dieser Auszahlung hinzufügen',
		cta: 'Grenze speichern',
	},
	savings: {
		title: 'Sparziele',
		subtitle: 'Aktive Meilensteine für dieses Jahr',
		newGoal: 'Neues Ziel',
		goals: [
			{ label: 'Altersvorsorge', value: '420.000 €', target: '273.000 €', progress: 65 },
			{ label: 'Immobilie', value: '85.000 €', target: '27.200 €', progress: 32 },
		],
		achieved: 'erreicht',
		note: 'Du hast deine Ziele für dieses Jahr noch nicht erreicht.',
	},
	empty: {
		title: 'Erstelle dein erstes Projekt',
		text: 'Projekte bündeln Dateien, Aufgaben und Personen an einem Ort.',
		cta: 'Neues Projekt',
	},
	balance: {
		title: 'Verfügbares Guthaben',
		value: '0,00 €',
		status: 'Einrichtung ausstehend',
		rows: [
			{ label: 'Nettoerlöse', value: '0,00 €' },
			{ label: 'Bearbeitungsgebühr', value: '−0,00 €' },
			{ label: 'Gesamt auszahlbar', value: '0,00 €' },
		],
		note: 'Sobald dein Bankkonto verbunden ist, wird das Guthaben monatlich ausgezahlt.',
	},
	transactions: {
		title: 'Letzte Transaktionen',
		subtitle: 'Deine aktuellen Kontoaktivitäten',
		items: [
			{
				icon: 'check_circle',
				title: 'Markt um die Ecke',
				meta: 'Lebensmittel',
				value: '−48,20 €',
			},
			{ icon: 'arrow_up', title: 'Monatsmiete', meta: 'Wohnen', value: '−1.250,00 €' },
			{ icon: 'clock', title: 'Streamingdienst', meta: 'Abo', value: '−12,99 €' },
			{ icon: 'arrow_down', title: 'Sparüberweisung', meta: 'Eingang', value: '+500,00 €' },
		],
	},
	notifications: {
		title: 'Benachrichtigungen',
		subtitle: 'Wähle, worüber du informiert werden möchtest.',
		items: ['Produkt-Updates', 'Wöchentliche Zusammenfassung', 'Marketing-E-Mails'],
	},
	promo: {
		title: 'Auf Pro upgraden',
		text: 'Dieses Modul liegt in einem Farbkontext der Marke. Jede Komponente darin folgt automatisch data-color.',
		cta: 'Upgraden',
		secondary: 'Nicht jetzt',
	},
	signIn: {
		title: 'Anmelden',
		subtitle: 'Gib deine E-Mail-Adresse ein, um auf dein Konto zuzugreifen.',
		email: 'E-Mail',
		password: 'Passwort',
		remember: 'Angemeldet bleiben',
		cta: 'Anmelden',
		forgot: 'Passwort vergessen?',
	},
	plan: {
		title: 'Tarif wählen',
		options: [
			{ label: 'Monatlich', meta: '12 € / Monat' },
			{ label: 'Jährlich', meta: '120 € / Jahr' },
		],
		addon: 'Priorisierten Support hinzufügen',
		cta: 'Weiter',
	},
	faq: {
		title: 'Häufige Fragen',
		items: [
			{
				question: 'Was bedeutet White Label?',
				answer:
					'Dieselben Komponenten und Tokens tragen eine andere Marke. Farben, Formen und Typografie ändern sich, die Struktur bleibt.',
			},
			{
				question: 'Welche Werte werden generiert?',
				answer:
					'Jede Farbe erhält 15 Palettenstufen sowie Origin-, Hover- und Pressed-Zustände. Alle semantischen Tokens leiten sich daraus ab.',
			},
			{
				question: 'Ist das Ergebnis barrierefrei?',
				answer:
					'Jede Palettenstufe hat über alle Farbtöne dieselbe Luminanz. Kontrastverhältnisse bleiben damit vorhersehbar.',
			},
		],
	},
	typography: {
		eyebrow: 'Leitfaden',
		title: 'Mit einem System für viele Marken gestalten',
		lead: 'Ein White-Label-Design-System trennt Struktur und Markenausdruck. Die Komponenten bleiben gleich, die Tokens tragen die Identität.',
		p1: 'Jedes Theme beginnt mit wenigen Entscheidungen: einer <strong>Origin-Farbe</strong>, einem neutralen Grundton, der Form der Ecken und den Schriften. Der <a href="/de/themebuilder?view=palettes" target="_top">Farbgenerator</a> macht aus jeder Origin-Farbe eine vollständige Palette.',
		h2: 'Von einer Farbe zur ganzen Palette',
		p2: 'Der Generator arbeitet in HSLuv. Dessen Helligkeit entspricht CIELUV L* und hängt nur von der Luminanz ab. Farben auf derselben Stufe haben daher denselben Kontrast zu Weiß und Schwarz, unabhängig vom Farbton.',
		list: [
			'<strong>15 Stufen</strong> von dunkel bis hell bilden die Kontrastleiter.',
			'<strong>Origin-Zustände</strong> für Hover und Pressed verschieben nur die Helligkeit.',
			'<strong>On-Origin</strong> nutzt das Ende der Rampe mit dem höheren Kontrast.',
		],
		quote: 'Konsistenz ist nicht Gleichförmigkeit. Ein System, viele Identitäten.',
		h3: 'Theme anwenden',
		p3: 'Exportiere das generierte CSS und lade es nach dem DB Theme. Die semantischen Tokens der Core Components übernehmen die neuen Werte automatisch.',
		h4: 'Überschrift Ebene 4',
		p4: 'Fließtext nutzt die gewählte Schrift für Fließtext. Überschriften nutzen die Schrift für Überschriften.',
	},
	showMore: 'Mehr anzeigen',
};

export const previewTexts = { en, de };
export type PreviewLang = keyof typeof previewTexts;
